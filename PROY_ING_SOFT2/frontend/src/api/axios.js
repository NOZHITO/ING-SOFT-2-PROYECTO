import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // ⚠️ IMPORTANTE
});

// Interceptor: agrega el token automáticamente a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
