import React, { useState, useEffect, useCallback } from 'react'
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
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { getStudents } from '@/api/students'
import { getAttendanceByMonth, saveAttendance } from '@/api/attendance'

export default function Attendance() {
  // Initial month setup
  const [month, setMonth] = useState(() => {
    const saved = localStorage.getItem('attendanceMonth')
    if (saved) return saved
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  useEffect(() => {
    localStorage.setItem('attendanceMonth', month)
  }, [month])

  const threshold = 75
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch students + attendance from DB
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const studentsData = await getStudents()
      const attendanceData = await getAttendanceByMonth(month)

      if (!Array.isArray(studentsData) || !Array.isArray(attendanceData)) {
        throw new Error('Invalid API response')
      }

      const [yearStr, monthStr] = month.split('-')
      const yearNum = parseInt(yearStr, 10)
      const monthNum = parseInt(monthStr, 10)
      const daysCount = new Date(yearNum, monthNum, 0).getDate()

      const merged = studentsData.map((student) => {
        const records = attendanceData.filter((rec) => rec.student_id === student.id)
        const attendance = {}
        let presentCount = 0

        // Initialize all days
        for (let d = 1; d <= daysCount; d++) {
          attendance[`day${d}`] = false
        }

        // Map actual records using Date parsing
        records.forEach((rec) => {
          // Ensure we handle both string and Date objects
          const recDate = rec.date instanceof Date ? rec.date : new Date(rec.date)
          const day = recDate.getDate()
          if (day >= 1 && day <= daysCount) {
            const isPresent = rec.status === 1
            attendance[`day${day}`] = isPresent
            if (isPresent) presentCount++
          }
        })

        const percentage = Math.round((presentCount / daysCount) * 100)
        return { id: student.id, name: student.name, attendance, percentage }
      })

      setStudents(merged)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to fetch attendance')
    } finally {
      setLoading(false)
    }
  }, [month])

  // Load data on mount & month change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Toggle checkbox locally
  const handleCheckboxChange = (studentId, dayKey, checked) => {
    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.id !== studentId) return stu
        const newAtt = { ...stu.attendance, [dayKey]: checked }
        const present = Object.values(newAtt).filter(Boolean).length
        const pct = Math.round((present / Object.keys(newAtt).length) * 100)
        return { ...stu, attendance: newAtt, percentage: pct }
      })
    )
  }

  // Save changes to DB then refresh
  const handleSave = async () => {
    setLoading(true)
    try {
      const [yearStr, monthStr] = month.split('-')
      const daysCount = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate()

      for (const stu of students) {
        for (let d = 1; d <= daysCount; d++) {
          const date = `${yearStr}-${monthStr.padStart(2, '0')}-${String(d).padStart(2, '0')}`
          await saveAttendance(stu.id, date, stu.attendance[`day${d}`])
        }
      }

      toast.success('Attendance saved to database')
      await fetchData()
    } catch (err) {
      console.error(err)
      toast.error('Save failed')
    } finally {
      setLoading(false)
    }
  }

  // Filter students
  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(s.id).includes(searchTerm)
  )

  // Table headers count
  const [yStr, mStr] = month.split('-')
  const totalDays = new Date(parseInt(yStr, 10), parseInt(mStr, 10), 0).getDate()

  return (
    <div className="space-y-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              {Array.from({ length: totalDays }, (_, i) => (
                <TableHead key={i}>{i + 1}</TableHead>
              ))}
              <TableHead>%</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((stu) => (
              <TableRow key={stu.id}>
                <TableCell>{stu.id}</TableCell>
                <TableCell>{stu.name}</TableCell>
                {Array.from({ length: totalDays }, (_, i) => {
                  const key = `day${i + 1}`
                  return (
                    <TableCell key={i}>
                      <input
                        type="checkbox"
                        checked={stu.attendance[key]}
                        onChange={(e) => handleCheckboxChange(stu.id, key, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </TableCell>
                  )
                })}
                <TableCell className={`pt-2 text-center ${stu.percentage < threshold ? 'text-red-500' : stu.percentage < 85 ? 'text-yellow-500' : 'text-green-500'}`}>{stu.percentage}%</TableCell>
                <TableCell className={`pt-2 text-center ${stu.percentage < threshold ? 'text-red-500' : stu.percentage < 85 ? 'text-yellow-500' : 'text-green-500'}`}>{stu.percentage < threshold ? 'At Risk' : stu.percentage < 85 ? 'Warning' : 'Good'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
