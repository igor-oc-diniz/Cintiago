import { api } from "./client";
import type { Order, CreateOrderPayload } from "@/types/domain";

export const getMyOrders = () =>
  api.get<Order[]>("/orders/my").then((r) => r.data);

export const getOrderById = (id: number) =>
  api.get<Order>(`/orders/${id}`).then((r) => r.data);

export const createOrder = (payload: CreateOrderPayload) =>
  api.post<Order>("/orders", payload).then((r) => r.data);
