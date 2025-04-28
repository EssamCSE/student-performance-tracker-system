import React, { useState, useMemo } from 'react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

ModuleRegistry.registerModules([AllCommunityModule])

export default function Attendance() {
  const [month, setMonth] = useState('2024-01')
  const [threshold] = useState(75)
  const [students, setStudents] = useState([
    {
      id: 'STU001',
      name: 'Alice Johnson',
      attendance: {
        day1: true,
        day2: true,
        day3: false,
        day4: true,
        day5: true,
        day6: true,
        day7: false,
        day8: true,
        day9: true,
        day10: true
      },
      percentage: 80
    },
    {
      id: 'STU002',
      name: 'Bob Smith',
      attendance: {
        day1: false,
        day2: true,
        day3: true,
        day4: false,
        day5: true,
        day6: false,
        day7: true,
        day8: true,
        day9: false,
        day10: true
      },
      percentage: 60
    },
    {
      id: 'STU003',
      name: 'Carol White',
      attendance: {
        day1: true,
        day2: true,
        day3: true,
        day4: true,
        day5: true,
        day6: true,
        day7: true,
        day8: true,
        day9: true,
        day10: true
      },
      percentage: 100
    }
  ])

  const columnDefs = useMemo(() => {
    const baseColumns = [
      {
        field: 'id',
        headerName: 'ID',
        width: 100,
        cellStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '12px'
        },
        headerClass: 'text-center'
      },
      {
        field: 'name',
        headerName: 'Name',
        width: 200,
        cellStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '12px'
        },
        headerClass: 'text-center'
      }
    ]

    const [year, monthNum] = month.split('-')
    const daysInMonth = new Date(year, monthNum, 0).getDate()

    const dayColumns = Array.from({ length: daysInMonth }, (_, i) => ({
      field: `day${i + 1}`,
      headerName: `${i + 1}`,
      width: 60,
      cellRenderer: (params) => {
        const dayKey = `day${i + 1}`
        const present = params.data.attendance[dayKey]
        const totalDays = daysInMonth

        return (
          <div className="flex items-center justify-center h-full pt-2">
            <input
              type="checkbox"
              checked={present}
              onChange={(e) => {
                const checked = e.target.checked
                setStudents((prev) =>
                  prev.map((student) => {
                    if (student.id !== params.data.id) return student

                    const attendance = {
                      ...student.attendance,
                      [dayKey]: checked
                    }
                    const presentCount = Object.values(attendance).filter(
                      (v) => v
                    ).length
                    const percentage = Math.round(
                      (presentCount / totalDays) * 100
                    )

                    return { ...student, attendance, percentage }
                  })
                )
              }}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
        )
      }
    }))

    return [
      ...baseColumns,
      ...dayColumns,
      {
        field: 'percentage',
        headerName: '%',
        width: 80,
        cellClass: (params) => {
          if (params.value < threshold) return 'text-red-500 bg-red-50 pt-2 text-center'
          if (params.value < 85) return 'text-yellow-500 bg-yellow-50 pt-2 text-center'
          return 'text-green-500 bg-green-50 pt-2 text-center'
        }
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
        valueGetter: (params) => {
          if (params.data.percentage < threshold) return 'At Risk'
          if (params.data.percentage < 85) return 'Warning'
          return 'Good'
        },
        cellClass: (params) => {
          if (params.data.percentage < threshold) return 'text-red-500 pt-2 text-center '
          if (params.data.percentage < 85) return 'text-yellow-500 pt-2 text-center'
          return 'text-green-500 pt-2 text-center'
        }
      }
    ]
  }, [month, threshold])

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

      <div
        className="ag-theme-quartz rounded-lg border bg-background text-foreground shadow-sm font-sans text-sm"
        style={{ height: '600px', width: '100%' }}
      >
        <AgGridReact
          rowData={students}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          headerHeight={48}
          rowHeight={48}
          suppressCellFocus={true}
          cellStyle={{ display: 'flex', alignItems: 'center' }}
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
            menuTabs: ['filterMenuTab']
          }}
        />
      </div>
    </div>
  )
}
