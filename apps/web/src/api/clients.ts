import { api } from "./client";
import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from "@/types/domain";

export const getMyProfile = () =>
  api.get<Client>("/clients/me").then((r) => r.data);

export const createClient = (payload: CreateClientPayload) =>
  api.post<Client>("/clients", payload).then((r) => r.data);

export const updateClient = (id: number, payload: UpdateClientPayload) =>
  api.patch<Client>(`/clients/${id}`, payload).then((r) => r.data);

export const updateMyProfile = (payload: UpdateClientPayload) =>
  api.patch<Client>("/clients/me", payload).then((r) => r.data);
