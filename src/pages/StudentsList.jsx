import React from 'react'

export default function StudentsList() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Students List</h2>
      <table className="w-full border-collapse bg-white shadow rounded overflow-hidden">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {/* Map your student data here */}
          <tr>
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2">Alice</td>
            <td className="border px-4 py-2">alice@example.com</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
