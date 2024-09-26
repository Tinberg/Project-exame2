
import axios, { AxiosInstance } from 'axios';

const apiKey = import.meta.env.VITE_API_KEY;

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://v2.api.noroff.dev',
  headers: {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': apiKey,
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
