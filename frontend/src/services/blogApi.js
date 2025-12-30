import axios from 'axios';

// const API_BASE = 'http://localhost:5000/api/blogs';
const API_BASE = 'https://beyond-chats-backend-inky.vercel.app/api/blogs';

export const blogApi = {
  getAll: () => axios.get(API_BASE),
  getById: (id) => axios.get(`${API_BASE}/${id}`),
  create: (data) => axios.post(API_BASE, data),
  update: (id, data) => axios.put(`${API_BASE}/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/${id}`),
  rewrite: () => axios.post(`${API_BASE}/rewrite`),
  scrape: () => axios.post(`${API_BASE}/scrape`),
};
