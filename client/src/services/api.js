import axios from 'axios';

// Get base URL dynamically
const getBaseUrl = () => {
  const customUrl = localStorage.getItem('api_base_url');
  if (customUrl) return customUrl;

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // If running on Vercel/production hostname, use Render backend default URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://school-payment-backend.onrender.com/api';
  }

  return '/api';
};

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set dynamic baseURL before each request
api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
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
