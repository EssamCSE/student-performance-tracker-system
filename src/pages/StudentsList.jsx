import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { addStudent, getStudents, updateStudent, deleteStudent } from '@/api/students'
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

export default function StudentsList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [programSearchTerm, setProgramSearchTerm] = useState('')
  const [students, setStudents] = useState([])
  const [error, setError] = useState('')
  const [newStudent, setNewStudent] = useState({
    id: '',
    name: '',
    program: '',
    year: '',
    email: '',
    phone: ''
  })

  const [editingStudent, setEditingStudent] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch students')
    }
  }

  const handleNewStudentChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'date' && name === 'year') {
      const yearValue = value ? new Date(value).getFullYear() : ''
      setNewStudent(prev => ({
        ...prev,
        [name]: yearValue
      }))
    } else {
      setNewStudent(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateStudent = (student) => {
    if (!student.id || student.id.trim() === '') return 'Student ID is required'
    if (!student.name || student.name.trim() === '') return 'Full name is required'
    if (!student.program || student.program.trim() === '') return 'Program is required'
    if (!student.year) return 'Year is required'
    if (!student.email || !student.email.includes('@')) return 'Valid email is required'
    if (!student.phone || student.phone.trim() === '') return 'Phone number is required'
    return null
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    setError('')
    
    const validationError = validateStudent(newStudent)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await addStudent(newStudent)
      await fetchStudents()
      setNewStudent({
        id: '',
        name: '',
        program: '',
        year: '',
        email: '',
        phone: ''
      })
      setDialogOpen(false)
      toast.success('Student added successfully!', {
        position: 'top-center',
        duration: 3000
      })
    } catch (err) {
      toast.error(err.message || 'Failed to add student', {
        position: 'top-center',
        duration: 3000
      })
      setError(err.message || 'Failed to add student')
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      student.program.toLowerCase().includes(programSearchTerm.toLowerCase())
  )

  const handleEditClick = (student) => {
    setEditingStudent({ ...student })
    setEditDialogOpen(true)
  }

  const handleEditChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'date' && name === 'year') {
      const yearValue = value ? new Date(value).getFullYear() : ''
      setEditingStudent((prev) => ({
        ...prev,
        [name]: yearValue
      }))
    } else {
      setEditingStudent((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSaveEdit = async () => {
    setError('')
    
    const validationError = validateStudent(editingStudent)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await updateStudent(editingStudent.id, editingStudent)
      await fetchStudents()
      setEditDialogOpen(false)
      toast.success('Student updated successfully!', {
        position: 'top-center',
        duration: 3000
      })
    } catch (err) {
      toast.error(err.message || 'Failed to update student', {
        position: 'top-center',
        duration: 3000
      })
      setError(err.message || 'Failed to update student')
    }
  }

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id)
      await fetchStudents()
      toast.success('Student deleted successfully!', {
        position: 'top-center',
        duration: 3000
      })
    } catch (err) {
      toast.error(err.message || 'Failed to delete student', {
        position: 'top-center',
        duration: 3000
      })
      setError(err.message || 'Failed to delete student')
    }
  }

  return (
    <div className="space-y-4">
      <Toaster position="top-center" />
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
            <form className="space-y-4" onSubmit={handleAddStudent}>
              <div className="space-y-2">
                <label htmlFor="id">Student ID</label>
                <Input 
                  id="id" 
                  name="id"
                  value={newStudent.id}
                  onChange={handleNewStudentChange}
                  placeholder="Enter student ID" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <Input 
                  id="name" 
                  name="name"
                  value={newStudent.name}
                  onChange={handleNewStudentChange}
                  placeholder="Enter full name" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="program">Program</label>
                <Input 
                  id="program" 
                  name="program"
                  value={newStudent.program}
                  onChange={handleNewStudentChange}
                  placeholder="Enter program" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="year">Year</label>
                <Input 
                  id="year" 
                  name="year"
                  type="date"
                  value={newStudent.year ? `${newStudent.year}-01-01` : ''}
                  onChange={handleNewStudentChange}
                  placeholder="Select year" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={newStudent.email}
                  onChange={handleNewStudentChange}
                  placeholder="Enter email" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone">Phone</label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={newStudent.phone}
                  onChange={handleNewStudentChange}
                  placeholder="Enter phone number" 
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">Save Student</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 py-4">
        <Input
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Search by program..."
          value={programSearchTerm}
          onChange={(e) => setProgramSearchTerm(e.target.value)}
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
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(student)}>
                    Edit
                  </Button>

                  {/* Delete with AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the student.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          Confirm Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label>ID</label>
                <Input
                  name="id"
                  value={editingStudent.id}
                  onChange={handleEditChange}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label>Name</label>
                <Input
                  name="name"
                  value={editingStudent.name}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <label>Program</label>
                <Input
                  name="program"
                  value={editingStudent.program}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <label>Year</label>
                <Input
                  name="year"
                  type="date"
                  value={editingStudent.year ? `${editingStudent.year}-01-01` : ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <label>Email</label>
                <Input
                  name="email"
                  value={editingStudent.email}
                  onChange={handleEditChange}
                />
              </div>
              <div className="space-y-2">
                <label>Phone</label>
                <Input
                  name="phone"
                  value={editingStudent.phone}
                  onChange={handleEditChange}
                />
              </div>
              <Button className="w-full" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
