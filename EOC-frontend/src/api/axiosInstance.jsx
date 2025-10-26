import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://eoc-website.onrender.com/api/v1', // Update to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // or wherever you save it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
