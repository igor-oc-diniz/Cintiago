import { api } from "./client";

export const getDevToken = () =>
  api.get<{ access_token: string }>("/auth/dev-token").then((r) => r.data);

// O login real acontece via redirect para /auth/google
// Esta função só constrói a URL de redirect
export const getGoogleAuthUrl = () =>
  `${import.meta.env.VITE_API_URL}/auth/google`;
