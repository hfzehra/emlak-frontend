﻿import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5038/api';

// Debug: Environment variable kontrolü
console.log('🌍 API Base URL:', API_BASE);
console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL);

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
    // 401 Unauthorized - sadece login dışındaki sayfalarda yönlendir
    if (err.response?.status === 401) {
      // Login endpoint'inden gelen 401'ler için yönlendirme yapma
      const isLoginRequest = err.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    // Tüm hataları reject et - component'lar kendi hata mesajlarını göstersin
    return Promise.reject(err);
  }
);

