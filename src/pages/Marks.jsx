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
  const [students] = useState([
    {
      id: 'STU001',
      name: 'Alice Johnson',
      quiz1: 85,
      quiz2: 90,
      quiz3: 88,
      midExam: 78,
      finalExam: 85,
      assignment1: 92,
      assignment2: 88,
      total: 85.75,
      grade: 'A'
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
      assignment2: 78,
      total: 74.25,
      grade: 'B'
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
      assignment2: 90,
      total: 92.25,
      grade: 'A'
    }
  ])

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'text-green-600'
      case 'B':
        return 'text-blue-600'
      case 'C':
        return 'text-yellow-600'
      default:
        return 'text-red-600'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Marks</h2>
        <Button>Save Changes</Button>
      </div>

      <div className="rounded-md border">
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
              <TableHead className="text-center">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={student.quiz1}
                    className="w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={student.quiz2}
                    className="w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={student.quiz3}
                    className="w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={student.midExam}
                    className="w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={student.finalExam}
                    className="w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={student.assignment1}
                    className="w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={student.assignment2}
                    className="w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {student.total}%
                </TableCell>
                <TableCell
                  className={`text-center font-semibold ${getGradeColor(
                    student.grade
                  )}`}
                >
                  {student.grade}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
