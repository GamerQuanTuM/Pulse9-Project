"use server"
import { baseUrl } from '@/constants/baseUrl';
import axios from 'axios';
import { cookies } from 'next/headers';

const serverAxiosInstance = axios.create({
  baseURL: baseUrl || 'http://localhost:3000/api',
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor
serverAxiosInstance.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor with retry logic
serverAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, message, code } = error;
    
    // Check for network errors (ECONNREFUSED, ETIMEDOUT, etc.)
    const isNetworkError = !error.response && Boolean(error.code);
    const isRetryable = isNetworkError && !config._retry;
    
    if (isRetryable) {
      // Mark this request as retried to prevent infinite loops
      config._retry = true;
      
      // Log the error for debugging
      console.error(`Network error (${code}). Retrying...`, error);
      
      try {
        // Wait for 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Retry the request
        return await serverAxiosInstance(config);
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        
        // Create a more user-friendly error message
        const friendlyError = new Error(
          'Unable to connect to the server. Please check your internet connection and try again.'
        );
        friendlyError.name = 'ConnectionError';
        return Promise.reject(friendlyError);
      }
    }
    
    // For other types of errors, just pass them through
    return Promise.reject(error);
  }
);

export default serverAxiosInstance;