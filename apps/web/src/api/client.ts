import axios from "axios";
import { store } from "@/store/store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Injeta o JWT Bearer token automaticamente em toda request
// Ignora o valor sentinela "cookie" — auth via cookie httpOnly não precisa de header
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token && token !== "cookie") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata 401 globalmente — limpa auth e redireciona para login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch({ type: "auth/logout" });
    }
    return Promise.reject(error);
  },
);
