import { api } from "./client";
import type {
  OrderDTO,
  CreateOrderPayloadDTO,
  CreateRatingPayloadDTO,
  OrderRatingDTO,
  PaginatedOrdersDTO,
} from "@cintiago/shared";

export const getMyOrders = () =>
  api.get<PaginatedOrdersDTO>("/orders/my").then((r) => r.data.data);

export const getOrderById = (id: number) =>
  api.get<OrderDTO>(`/orders/my/${id}`).then((r) => r.data);

export const createOrder = (payload: CreateOrderPayloadDTO) =>
  api.post<OrderDTO>("/orders", payload).then((r) => r.data);

export const rateOrder = (id: number, payload: CreateRatingPayloadDTO) =>
  api.post<OrderRatingDTO>(`/orders/${id}/rating`, payload).then((r) => r.data);
