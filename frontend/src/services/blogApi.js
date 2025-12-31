import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const blogApi = {
  getAll: () => axios.get(API_BASE),
  getById: (id) => axios.get(`${API_BASE}/${id}`),
};
