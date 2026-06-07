import type { DeliveryAddress } from "@/types/domain";

export const DELIVERY_FEE = 8.9;

export const DELIVERY_ETA = "30–45 min";

export const PIZZERIA = {
  address: "Rua das Oliveiras, 112",
  neighborhood: "Vila Madalena · São Paulo",
  ready: "~20 min",
} as const;

export const ADDRESS_DEFAULT: DeliveryAddress = {
  cep: "05435-040",
  rua: "Rua Aspicuelta",
  number: "512",
  complement: "Apto 41",
  neighborhood: "Vila Madalena",
  city: "São Paulo",
};
