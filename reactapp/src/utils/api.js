import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE}/api`
});

export default api;
