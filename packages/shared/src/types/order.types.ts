import type { ClientDTO } from "./client.types";
import type { CrustDTO } from "./crust.types";
import type { IngredientDTO } from "./ingredient.types";
import type { PaymentDTO } from "./payment.types";
import type { PizzaDTO } from "./pizza.types";
import type { ProductDTO } from "./product.types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivering"
  | "delivered"
  | "cancelled";
export type PizzaSize = "small" | "medium" | "large";

export interface OrderItemHalfIngredientDTO {
  orderItemHalfId: number;
  ingredientId: number;
  action: string;
  ingredient: IngredientDTO;
}

export interface OrderItemHalfDTO {
  id: number;
  orderItemId: number;
  pizzaId: number;
  half: number;
  pizza: PizzaDTO;
  ingredients: OrderItemHalfIngredientDTO[];
}

export interface OrderItemDTO {
  id: number;
  orderId: number;
  crustId: number | null;
  size: string;
  quantity: number;
  price: string | null;
  crust: CrustDTO | null;
  halves: OrderItemHalfDTO[];
}

export interface OrderProductDTO {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  product: ProductDTO;
}

export interface OrderDTO {
  id: number;
  clientId: number;
  paymentId: number;
  total: string | null;
  status: OrderStatus;
  createdAt: string;
  client: ClientDTO;
  payment: PaymentDTO;
  orderItems: OrderItemDTO[];
  orderProducts: OrderProductDTO[];
}

export interface CreateOrderItemHalfIngredientPayloadDTO {
  ingredientId: number;
  action: "add" | "remove";
}

export interface CreateOrderItemHalfPayloadDTO {
  pizzaId: number;
  half: 1 | 2;
  ingredients?: CreateOrderItemHalfIngredientPayloadDTO[];
}

export interface CreateOrderItemPayloadDTO {
  size: PizzaSize;
  crustId?: number;
  quantity: number;
  halves: CreateOrderItemHalfPayloadDTO[];
}

export interface CreateOrderProductPayloadDTO {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayloadDTO {
  paymentId: number;
  items: CreateOrderItemPayloadDTO[];
  products?: CreateOrderProductPayloadDTO[];
}
