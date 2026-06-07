export type OrderStatus =
  | "pending"
  | "preparing"
  | "delivering"
  | "delivered"
  | "cancelled";

export type DeliveryType = "delivery" | "pickup";

export type Role = "OPERATOR" | "CLIENT";

export interface Ingredient {
  id: number;
  name: string;
  price: number;
  isVegetarian: boolean;
}

export interface Pizza {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  ingredients: Ingredient[];
  prices: { size: "small" | "medium" | "large"; price: number }[];
  isVegetarian: boolean;
  isNew: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: string;
}

export interface Crust {
  id: number;
  name: string;
  additionalPrice: number;
}

export interface Payment {
  id: number;
  name: string;
  type: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  zipCode: string;
}

export interface OrderItemHalfIngredient {
  ingredientId: number;
  action: "add" | "remove";
}

export interface OrderItemHalf {
  pizzaId: number;
  half: 1 | 2;
  ingredients?: OrderItemHalfIngredient[];
}

export interface OrderItemPayload {
  size: "small" | "medium" | "large";
  crustId?: number;
  quantity: number;
  halves: OrderItemHalf[];
}

export interface OrderProductPayload {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  clientId: number;
  paymentId: number;
  deliveryType: DeliveryType;
  items: OrderItemPayload[];
  products: OrderProductPayload[];
}

export interface OrderItem {
  id: number;
  size: string;
  quantity: number;
  crust: Crust | null;
  halves: {
    half: 1 | 2;
    pizza: Pick<Pizza, "id" | "name" | "imageUrl">;
    ingredients: OrderItemHalfIngredient[];
  }[];
}

export interface Order {
  id: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  total: number;
  createdAt: string;
  client: Pick<Client, "id" | "name" | "address" | "number" | "city">;
  payment: Payment;
  items: OrderItem[];
  products: {
    product: Product;
    quantity: number;
  }[];
}

export interface CreateClientPayload {
  userId: number;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

export type UpdateClientPayload = Partial<CreateClientPayload>;

export interface DeliveryAddress {
  cep: string;
  rua: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: Role;
  clientId: number | null; // null se cadastro incompleto
}
