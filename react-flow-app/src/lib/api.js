import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1', // This will be the base for all API requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
