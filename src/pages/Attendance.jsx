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

export default function Attendance() {
  const [month, setMonth] = useState('2024-01')
  const [threshold] = useState(75)
  const [students] = useState([
    {
      id: 'STU001',
      name: 'Alice Johnson',
      attendance: [
        true, true, false, true, true,
        true, false, true, true, true,
        true, true, true, false, true,
        true, true, true, true, true
      ],
      percentage: 90
    },
    {
      id: 'STU002',
      name: 'Bob Smith',
      attendance: [
        true, false, false, true, true,
        true, false, true, false, true,
        true, true, false, false, true,
        true, false, true, true, true
      ],
      percentage: 70
    },
    {
      id: 'STU003',
      name: 'Carol White',
      attendance: [
        true, true, true, true, true,
        true, true, true, true, true,
        true, false, true, true, true,
        true, true, true, true, true
      ],
      percentage: 95
    }
  ])

  const getStatusColor = (percentage) => {
    if (percentage < threshold) return 'text-red-500'
    if (percentage < 85) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatus = (percentage) => {
    if (percentage < threshold) return 'At Risk'
    if (percentage < 85) return 'Warning'
    return 'Good'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Attendance</h2>
        <div className="flex gap-4">
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-40"
          />
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((day) => (
                <TableHead key={day} className="text-center w-10">
                  {day}
                </TableHead>
              ))}
              <TableHead className="text-center">%</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                {student.attendance.map((present, index) => (
                  <TableCell key={index} className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={present ? 'text-green-600' : 'text-red-600'}
                    >
                      {present ? 'P' : 'A'}
                    </Button>
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  {student.percentage}%
                </TableCell>
                <TableCell className={getStatusColor(student.percentage)}>
                  {getStatus(student.percentage)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
