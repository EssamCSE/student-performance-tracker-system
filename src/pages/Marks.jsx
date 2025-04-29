import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getAllMarks, getStudentMarks, updateMarks } from '@/api/marks'
import { getStudents } from '@/api/students'

export default function Marks() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await getStudents()
        const marksData = await getAllMarks()
        
        const mergedData = studentsData.map(student => {
          const studentMarks = marksData.find(m => m.student_id === student.id) || {}
          return {
            id: student.id,
            name: student.name,
            quiz1: studentMarks.quiz1 || 0,
            quiz2: studentMarks.quiz2 || 0,
            quiz3: studentMarks.quiz3 || 0,
            midExam: studentMarks.midExam || 0,
            finalExam: studentMarks.finalExam || 0,
            assignment1: studentMarks.assignment1 || 0,
            assignment2: studentMarks.assignment2 || 0
          }
        })
        
        setStudents(mergedData)
      } catch (err) {
        setError(err.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    
    // Add event listener for page refresh
    window.addEventListener('beforeunload', fetchData);
    
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', fetchData);
    };
  }, [])

  const handleSave = async () => {
    try {
      setLoading(true)
      setError('')
      
      const results = await Promise.all(
        students.map(async (student) => {
          const marksData = {
            student_id: student.id,
            quiz1: student.quiz1 || null,
            quiz2: student.quiz2 || null,
            quiz3: student.quiz3 || null,
            midExam: student.midExam || null,
            finalExam: student.finalExam || null,
            assignment1: student.assignment1 || null,
            assignment2: student.assignment2 || null
          }
          return await updateMarks(student.id, marksData)
        })
      )
      
      // Show success message if all updates succeeded
      setError('Marks saved successfully!')
    } catch (err) {
      console.error('Save error:', err)
      setError(err.response?.data?.error || err.message || 'Failed to save marks')
    } finally {
      setLoading(false)
    }
  }

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'text-green-600'
      case 'B':
        return 'text-blue-600'
      case 'C':
        return 'text-yellow-600'
      case 'D':
        return 'text-orange-600'
      default:
        return 'text-red-600'
    }
  }

  const handleInputChange = (id, field, value) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id
          ? { ...student, [field]: Number(value) }
          : student
      )
    )
  }

  const calculateTotal = (student) => {
    const {
      quiz1 = 0,
      quiz2 = 0,
      quiz3 = 0,
      midExam = 0,
      finalExam = 0,
      assignment1 = 0,
      assignment2 = 0
    } = student
    
    // Calculate total marks with proper rounding for each component
    const totalMarks = Math.round(
      Number(quiz1) + 
      Number(quiz2) + 
      Number(quiz3) + 
      Number(midExam) + 
      Number(finalExam) + 
      Number(assignment1) + 
      Number(assignment2)
    )
    
    // Calculate percentage with proper handling of division
    const maxPossible = 7 * 100 // Assuming each component is out of 100
    const percentage = maxPossible > 0 ? (totalMarks / maxPossible) * 100 : 0
    const grade = getGrade(percentage)
    return { totalMarks, percentage, grade }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Marks</h2>
        <Button onClick={handleSave} disabled={loading}>
  {loading ? 'Saving...' : 'Save Changes'}
</Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Quiz 1</TableHead>
              <TableHead className="text-center">Quiz 2</TableHead>
              <TableHead className="text-center">Quiz 3</TableHead>
              <TableHead className="text-center">Midterm</TableHead>
              <TableHead className="text-center">Final</TableHead>
              <TableHead className="text-center">Assign 1</TableHead>
              <TableHead className="text-center">Assign 2</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Percentage</TableHead>
              <TableHead className="text-center">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const { totalMarks, percentage, grade } = calculateTotal(student)
              return (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  {['quiz1', 'quiz2', 'quiz3', 'midExam', 'finalExam', 'assignment1', 'assignment2'].map((field) => (
                    <TableCell key={field} className="text-center">
                      <Input
                        type="number"
                        value={student[field] ? Math.round(student[field]) : ''}
                        onChange={(e) =>
                          handleInputChange(student.id, field, e.target.value)
                        }
                        className="w-20 text-center"
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-semibold">
                    {totalMarks}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {percentage.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className={`text-center font-semibold ${getGradeColor(
                      grade
                    )}`}
                  >
                    {grade}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
