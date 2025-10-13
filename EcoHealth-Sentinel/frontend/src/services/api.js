// src/services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Usage
import api from './services/api';

// Login
const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return data;
};

// Get dashboard
const getDashboard = async () => {
  const { data } = await api.get('/agriculture/dashboard');
  return data;
};

// Chatbot
const sendMessage = async (domain, message) => {
  const { data } = await api.post(`/chatbot/${domain}`, { message });
  return data;
};