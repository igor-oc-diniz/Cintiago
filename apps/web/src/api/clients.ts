import { api } from "./client";
import type {
  ClientDTO,
  CreateClientPayloadDTO,
  UpdateClientPayloadDTO,
} from "@cintiago/shared";

export const getMyProfile = () =>
  api.get<ClientDTO>("/clients/me").then((r) => r.data);

export const createClient = (payload: CreateClientPayloadDTO) =>
  api.post<ClientDTO>("/clients", payload).then((r) => r.data);

export const updateClient = (id: number, payload: UpdateClientPayloadDTO) =>
  api.patch<ClientDTO>(`/clients/${id}`, payload).then((r) => r.data);

export const updateMyProfile = (payload: UpdateClientPayloadDTO) =>
  api.patch<ClientDTO>("/clients/me", payload).then((r) => r.data);
