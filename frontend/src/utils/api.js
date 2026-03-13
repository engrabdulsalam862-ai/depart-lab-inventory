// frontend/src/utils/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await axios.post(`${API_BASE_URL}/login`, formData);
  return response.data;
};

export const signup = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/signup`, userData, {
    timeout: 30000 // 30 second timeout for signup (password hashing takes time)
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
  return response.data;
};

export const verifyRecoveryCode = async (email, recoveryCode) => {
  const response = await axios.post(`${API_BASE_URL}/verify-recovery-code`, {
    email,
    recovery_code: recoveryCode,
  });
  return response.data;
};

export const resetPassword = async (resetData) => {
  const response = await axios.post(`${API_BASE_URL}/reset-password`, resetData);
  return response.data;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Equipment API
export const getEquipments = () => api.get('/equipments');
export const createEquipment = (data) => api.post('/equipments', data);
export const updateEquipment = (id, data) => api.put(`/equipments/${id}`, data);
export const deleteEquipment = (id) => api.delete(`/equipments/${id}`);

// Issue API
export const getIssues = () => api.get('/issues');
export const createIssue = (data) => api.post('/issues', data);
export const updateIssue = (id, data) => api.put(`/issues/${id}`, data);
export const deleteIssue = (id) => api.delete(`/issues/${id}`);

// Maintenance API
export const getMaintenance = () => api.get('/maintenance');
export const createMaintenance = (data) => api.post('/maintenance', data);
export const updateMaintenance = (id, data) => api.put(`/maintenance/${id}`, data);
export const deleteMaintenance = (id) => api.delete(`/maintenance/${id}`);

export default api;