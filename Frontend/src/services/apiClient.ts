import axios from 'axios';

const API_BASE = 'http://localhost:5038/api';

export const apiClient = axios.create({ baseURL: API_BASE });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Geliştirme için X-Company-Id header'ı (backend'te fallback olarak kullanılıyor)
  const tenantId = localStorage.getItem('tenantId');
  if (tenantId) {
    config.headers['X-Company-Id'] = tenantId;
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

