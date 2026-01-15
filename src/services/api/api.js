import axios from 'axios';

// Use environment variable or default to production Render URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sinhgadconnectbackend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

let store;

export const injectStore = (_store) => {
  store = _store;
};

// Helper to get token
const getToken = () =>
  store?.getState()?.auth?.token ||
  localStorage.getItem('token') ||
  sessionStorage.getItem('token');

// Helper to clear auth data
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Public endpoints that don't require auth
    const publicEndpoints = ['/auth/login', '/auth/register'];
    const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));

    if (!isPublic) {
      // All other endpoints require the token
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
      originalRequest._retry = true;

      // Clear auth and redirect to login
      clearAuthData();

      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    return Promise.reject(error);
  }
);

export { api };
