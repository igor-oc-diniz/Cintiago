import { api } from "./client";
import type { OrderDTO, CreateOrderPayloadDTO } from "@cintiago/shared";

export const getMyOrders = () =>
  api.get<OrderDTO[]>("/orders/my").then((r) => r.data);

export const getOrderById = (id: number) =>
  api.get<OrderDTO>(`/orders/${id}`).then((r) => r.data);

export const createOrder = (payload: CreateOrderPayloadDTO) =>
  api.post<OrderDTO>("/orders", payload).then((r) => r.data);
