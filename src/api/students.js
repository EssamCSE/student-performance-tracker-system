import axios from 'axios';

const API_URL = '/api';

export const addStudent = async (studentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/students`, studentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add student' };
  }
};

export const getStudents = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/students`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch students' };
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/students/${id}`, studentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update student' };
  }
};

export const deleteStudent = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete student' };
  }
};