import axios from "axios";
import { store } from "@/store/store";
import { COOKIE_TOKEN } from "@/constants/auth";
import { refreshTokenApi } from "./refreshToken";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Automatically injects the JWT Bearer token on every request
// Ignores the COOKIE_TOKEN sentinel — auth via httpOnly cookie doesn't need the header
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token && token !== COOKIE_TOKEN) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handles 401 globally — clears auth and redirects to login
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshTokenApi();
        return api(originalRequest);
      } catch {
        store.dispatch({ type: "auth/logout" });
      }
    }
    return Promise.reject(error);
  },
);
