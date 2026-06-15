import type { DeliveryAddress } from "@/types/domain";

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
