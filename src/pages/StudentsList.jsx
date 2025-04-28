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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export default function StudentsList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [students] = useState([
    {
      id: 'STU001',
      name: 'Alice Johnson',
      program: 'Computer Science',
      year: '3rd Year',
      email: 'alice@example.com',
      phone: '+1234567890'
    },
    {
      id: 'STU002',
      name: 'Bob Smith',
      program: 'Engineering',
      year: '2nd Year',
      email: 'bob@example.com',
      phone: '+1234567891'
    },
    {
      id: 'STU003',
      name: 'Carol White',
      program: 'Mathematics',
      year: '4th Year',
      email: 'carol@example.com',
      phone: '+1234567892'
    }
  ])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Students List</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="id">Student ID</label>
                <Input id="id" placeholder="Enter student ID" />
              </div>
              <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="program">Program</label>
                <Input id="program" placeholder="Enter program" />
              </div>
              <div className="space-y-2">
                <label htmlFor="year">Year</label>
                <Input id="year" placeholder="Enter year" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone">Phone</label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <Button type="submit" className="w-full">Save Student</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>{student.year}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
