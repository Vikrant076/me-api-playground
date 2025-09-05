import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  getProjects: (skill) => api.get('/projects', { params: { skill } }),
  getTopSkills: (limit) => api.get('/skills/top', { params: { limit } }),
  search: (query) => api.get('/search', { params: { q: query } }),
};

export const healthCheck = () => api.get('/health');

export default api;
