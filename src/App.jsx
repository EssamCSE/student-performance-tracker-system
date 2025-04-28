import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppSidebar } from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import StudentsList from './pages/StudentsList'
import Attendance from './pages/Attendance'
import Marks from './pages/Marks'

export default function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-auto bg-gray-100">
          <main className="p-6 flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students/list" element={<StudentsList />} />
              <Route path="/students/attendance" element={<Attendance />} />
              <Route path="/students/marks" element={<Marks />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}
