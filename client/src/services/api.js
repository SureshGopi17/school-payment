import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept request to add token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTransactions = async (params) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const fetchSchoolTransactions = async (school_id, params) => {
  const response = await api.get(`/transactions/school/${school_id}`, { params });
  return response.data;
};

export const fetchDistinctSchools = async () => {
  const response = await api.get('/transactions/schools');
  return response.data;
};

export const checkTransactionStatus = async (custom_order_id) => {
  const response = await api.get(`/transactions/status/${custom_order_id}`);
  return response.data;
};

export const updateTransactionStatus = async (payload) => {
  const response = await api.post('/transactions/manual-update', payload);
  return response.data;
};

export const sendWebhookPayload = async (payload) => {
  const response = await api.post('/webhook', payload);
  return response.data;
};

export const createCollectPaymentRequest = async (payload) => {
  const response = await api.post('/payment/create-collect-request', payload);
  return response.data;
};

export const fetchAnalyticsData = async () => {
  const response = await api.get('/transactions/analytics');
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export default api;
