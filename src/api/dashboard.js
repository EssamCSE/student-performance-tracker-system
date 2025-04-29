// src/api/dashboard.js
import axios from 'axios';

// Helper to attach auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch dashboard statistics from the server.
 * @returns {Promise<Object>} Statistics payload:
 *    {
 *      totalStudents,
 *      avgAttendance,
 *      attendanceDistribution,
 *      topStudents,
 *      excellentStudents,
 *      monthlyTrend
 *    }
 */
export const getDashboardStats = async () => {
  try {
    const response = await axios.get('/api/dashboard', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

