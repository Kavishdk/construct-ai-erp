import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token expired or invalid
      const token = localStorage.getItem('token');
      if (token) {
        // Only if we had a token do we care to clear and retry
        console.warn("Session expired or invalid. Clearing token.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Reload page to trigger App.tsx auto-login logic
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
