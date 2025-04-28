import React, { useState } from 'react'
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

export default function Marks() {
  const [students, setStudents] = useState([
    {
      id: 'STU001',
      name: 'Alice Johnson',
      quiz1: 85,
      quiz2: 90,
      quiz3: 88,
      midExam: 78,
      finalExam: 85,
      assignment1: 92,
      assignment2: 88
    },
    {
      id: 'STU002',
      name: 'Bob Smith',
      quiz1: 75,
      quiz2: 70,
      quiz3: 68,
      midExam: 72,
      finalExam: 75,
      assignment1: 82,
      assignment2: 78
    },
    {
      id: 'STU003',
      name: 'Carol White',
      quiz1: 95,
      quiz2: 92,
      quiz3: 94,
      midExam: 88,
      finalExam: 92,
      assignment1: 95,
      assignment2: 90
    }
  ])

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
    const totalMarks = quiz1 + quiz2 + quiz3 + midExam + finalExam + assignment1 + assignment2
    const percentage = totalMarks / 7 // Because there are 7 items
    const grade = getGrade(percentage)
    return { totalMarks, percentage, grade }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Marks</h2>
        <Button>Save Changes</Button>
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
                        value={student[field]}
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
