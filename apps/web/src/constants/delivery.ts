import type { DeliveryAddress } from "@/types/domain";

export const DELIVERY_TYPE = {
  delivery: "delivery",
  pickup: "pickup",
  dineIn: "dine_in",
} as const;

// Fonte única dos rótulos de tipo de entrega (texto padronizado).
export const DELIVERY_LABEL: Record<string, string> = {
  delivery: "Delivery",
  pickup: "Retirada no local",
  dine_in: "Comer no salão",
};

// Taxa, endereço e ETA agora vêm do backend (GET /store/info, via useStoreInfo).
// Aqui resta apenas o endereço padrão do formulário de entrega do cliente.
export const ADDRESS_DEFAULT: DeliveryAddress = {
  cep: "05435-040",
  rua: "Rua Aspicuelta",
  number: "512",
  complement: "Apto 41",
  neighborhood: "Vila Madalena",
  city: "São Paulo",
};
