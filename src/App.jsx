import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppSidebar } from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import StudentsList from './pages/StudentsList'
import Attendance from './pages/Attendance'
import Marks from './pages/Marks'
import Auth from './pages/Auth'

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  if (!user || !token) {
    return <Navigate to="/auth" replace />
  }
  return children
}

function AppLayout({ children }) {
  return (
    <div className="flex h-screen">
      <div className="w-64 fixed h-full border-r bg-background">
        <AppSidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto bg-gray-100">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/list"
          element={
            <ProtectedRoute>
              <AppLayout>
                <StudentsList />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/attendance"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Attendance />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/marks"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Marks />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
