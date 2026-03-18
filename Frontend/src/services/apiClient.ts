﻿import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5038/api';

// Production modunda console.log'ları kaldır
const isDev = import.meta.env.DEV;
if (isDev) {
  console.log('🌍 API Base URL:', API_BASE);
}

export const apiClient = axios.create({ 
  baseURL: API_BASE,
  timeout: 30000, // 30 saniye timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request cache - aynı istekleri önlemek için
const requestCache = new Map<string, Promise<any>>();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const tenantId = localStorage.getItem('tenantId');
  if (tenantId) {
    config.headers['X-Company-Id'] = tenantId;
  }

  // GET requestler için cache kontrolü
  if (config.method === 'get') {
    const cacheKey = `${config.url}_${JSON.stringify(config.params)}`;
    const cachedRequest = requestCache.get(cacheKey);
    
    if (cachedRequest) {
      // Aynı request pending ise, cache'den döndür
      return Promise.reject({ 
        __CANCEL__: true, 
        promise: cachedRequest 
      });
    }
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (res) => {
    // Cache'den temizle
    if (res.config.method === 'get') {
      const cacheKey = `${res.config.url}_${JSON.stringify(res.config.params)}`;
      requestCache.delete(cacheKey);
    }
    return res;
  },
  async (err) => {
    // Cache'den temizle
    if (err.config?.method === 'get') {
      const cacheKey = `${err.config.url}_${JSON.stringify(err.config.params)}`;
      requestCache.delete(cacheKey);
    }

    // Özel cancel durumu
    if (err.__CANCEL__) {
      return err.promise;
    }

    // 401 Unauthorized - Token süresi dolmuş
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tenantId');
      window.location.href = '/login';
      return Promise.reject(err);
    }

    // Network hatası veya timeout - retry logic
    if (!err.response && err.config && !err.config.__isRetry) {
      err.config.__isRetry = true;
      try {
        return await apiClient.request(err.config);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(err);
  }
);

