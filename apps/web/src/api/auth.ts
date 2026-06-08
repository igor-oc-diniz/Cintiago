import { api } from "./client";
import type { MeDTO } from "@cintiago/shared";

export const getDevToken = () =>
  api.get<{ access_token: string }>("/auth/dev-token").then((r) => r.data);

export const getGoogleAuthUrl = () =>
  `${import.meta.env.VITE_API_URL}/auth/google`;

export const getMe = () => api.get<MeDTO>("/auth/me").then((r) => r.data);

export const logoutApi = () => api.post("/auth/logout");
