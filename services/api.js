import axios from 'axios';

const api = axios.create({
  baseURL: 'https://newcareback-hhcsb3era0gwctg3.centralus-01.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
