import axios from 'axios';

const API_URL = '/api';

export const getStudentMarks = async (studentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/marks/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching student marks:', err);
    throw err;
  }
};

export const getAllMarks = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/marks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching all marks:', err);
    throw err;
  }
};

export const updateMarks = async (studentId, marksData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/marks`, {
      ...marksData,
      student_id: studentId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error updating marks:', err);
    throw err;
  }
};

export const createMarks = async (marksData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/marks`, marksData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error creating marks:', err);
    throw err;
  }
};