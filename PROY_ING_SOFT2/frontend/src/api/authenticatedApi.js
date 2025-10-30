import api from "./axios";

const authenticatedApi = api;

authenticatedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default authenticatedApi;
