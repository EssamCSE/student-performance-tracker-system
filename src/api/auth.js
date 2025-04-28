// auth.js
import axios from 'axios';

const API_URL = '/api';

// Register User
export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;  // No need to wrap inside { data: ... }
    } catch (error) {
      // Re-throw a real error
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };
  
  export const loginUser = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;  // Same here
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };
  