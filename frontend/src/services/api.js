import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`,
});

api.interceptors.request.use(
  (config) => {
    const localData = localStorage.getItem('userInfo');
    if (localData) {
      const parsed = JSON.parse(localData);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getProfile: () => api.get('/auth/profile'),
};

export const fileAPI = {
  getFiles: (params) => api.get('/files', { params }),
  uploadFile: (formData) => api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateFile: (id, data) => api.put(`/files/${id}`, data),
  deleteFile: (id) => api.delete(`/files/${id}`),
};

export const folderAPI = {
  getFolders: (params) => api.get('/folders', { params }),
  createFolder: (name, parentId, color) => api.post('/folders', { name, parentId, color }),
};
