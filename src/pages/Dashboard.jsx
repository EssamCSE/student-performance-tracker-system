import React from 'react'

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-white shadow rounded">
          Widget {i}
        </div>
      ))}
    </div>
  )
}
