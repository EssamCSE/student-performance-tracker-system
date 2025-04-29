import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getDashboardStats } from '@/api/dashboard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          console.error('Empty or invalid dashboard data:', data);
          setError('Received empty dashboard data');
        } else {
          setStats(data);
        }
      })
      .catch(err => {
        console.error('Dashboard API error:', err.response?.data || err.message || err);
        setError('Unable to load dashboard data');
      });
  }, []);

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }
  if (!stats) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Student Management Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Students', value: stats.totalStudents, caption: 'Enrolled' },
          { title: 'Avg Attendance', value: `${stats.avgAttendance}%`, caption: 'This month' },
          { title: 'Excellent Students', value: stats.excellentStudents, caption: '≥90% marks & attendance' },
          { title: '—', value: '', caption: '' }
        ].map((c, i) => (
          <Card key={i}>
            <CardHeader><CardTitle>{c.title}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{c.value}</p>
              {c.caption && <p className="text-sm text-gray-500">{c.caption}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Distribution & Top 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Attendance Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.attendanceDistribution}
                  cx="50%" cy="50%" outerRadius={80}
                  dataKey="value" label
                >
                  {stats.attendanceDistribution.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Performing Students</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                layout="vertical" data={stats.topStudents}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="marks" fill="#4CAF50" name="Avg Marks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader><CardTitle>Monthly Attendance Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#4CAF50" strokeWidth={2} dot={{ fill: '#4CAF50', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#4CAF50' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
