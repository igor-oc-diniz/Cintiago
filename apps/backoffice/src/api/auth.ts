import { api } from "./client";
import type { MeDTO } from "@cintiago/shared";

// Dev only — GET /auth/dev-token returns 404 outside NODE_ENV=development.
// Used for session bootstrap in Phase 0, while the real Google login for the
// backoffice (with per-origin redirect) isn't implemented yet (see Phase 1).
export const getDevToken = () =>
  api.get<{ token: string }>("/auth/dev-token").then((r) => r.data);

export const getMe = () => api.get<MeDTO>("/auth/me").then((r) => r.data);
