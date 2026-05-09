import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const setUnauthorizedHandler = (handler) => {
  api.defaults.onUnauthorized = handler;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eventify_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("eventify_token");
      localStorage.removeItem("eventify_user");
      api.defaults.onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export default api;
