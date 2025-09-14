import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  (config) => {
    // Add stack API key if available
    const stackApiKey = localStorage.getItem('stackApiKey');
    if (stackApiKey) {
      config.headers['x-stack-api-key'] = stackApiKey;
    }

    // Add environment parameter
    const environment = localStorage.getItem('environment') || 'development';
    if (config.method === 'get' && !config.params) {
      config.params = {};
    }
    if (config.params && !config.params.environment) {
      config.params.environment = environment;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('stackApiKey');
      // Could redirect to auth page
    }

    if (error.response?.status === 429) {
      // Rate limit exceeded
      console.warn('Rate limit exceeded. Please try again later.');
    }

    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
    });

    return Promise.reject(error);
  }
);

export default apiClient;
