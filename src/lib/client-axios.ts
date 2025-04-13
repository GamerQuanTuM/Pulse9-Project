import { baseUrl } from '@/constants/baseUrl';
import axios from 'axios';

const clientAxiosInstance = axios.create({
  baseURL: baseUrl || 'http://localhost:3000/api',
  timeout: 10000,
});

// Add request interceptor
clientAxiosInstance.interceptors.request.use(
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

export default clientAxiosInstance;