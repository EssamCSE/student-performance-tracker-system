import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attendance';

// Helper to get Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch attendance records for a specific month.
 * @param {string} month - Year-month string (e.g., '2024-01').
 * @returns {Promise<Array>} Array of attendance objects.
 */
export const getAttendanceByMonth = async (month) => {
  try {
    const response = await axios.get(`${API_URL}/${month}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
};

/**
 * Save (upsert) a single attendance record.
 * @param {string} studentId
 * @param {string} date - YYYY-MM-DD
 * @param {boolean} status
 */
export const saveAttendance = async (studentId, date, status) => {
  try {
    const response = await axios.post(
      API_URL,
      { studentId, date, status: status ? 1 : 0 },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving attendance:', error);
    throw error;
  }
};

/**
 * Save multiple attendance records in batch.
 * @param {Array} students - Array of student objects with attendance.
 * @param {string} month
 */
export const saveAllAttendance = async (students, month) => {
  try {
    const [year, monthNum] = month.split('-');
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const records = [];

    students.forEach((student) => {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${monthNum.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        records.push({
          studentId: student.id,
          date,
          status: student.attendance[`day${day}`] ? 1 : 0
        });
      }
    });

    const response = await axios.post(
      `${API_URL}/batch`,
      { records },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving batch attendance:', error);
    throw error;
  }
};

/**
 * Fetch batch attendance for a given month.
 * @param {string} month
 */
export const getBatchAttendance = async (month) => {
  try {
    const response = await axios.get(`${API_URL}/batch/${month}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching batch attendance:', error);
    throw error;
  }
};
