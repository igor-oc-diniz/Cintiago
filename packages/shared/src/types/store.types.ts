// Dados públicos do estabelecimento (GET /store/info)
export interface StoreInfoDTO {
  id: number;
  name: string;
  description: string | null;
  phone: string;
  email: string | null;
  isOpen: boolean;
  deliveryFee: string;
  minOrderValue: string | null;
  openingHours: string | null;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  zipCode: string;
  // Tempos para o frontend derivar o ETA de vitrine (mesma fórmula do computeEta dos pedidos)
  basePrepMinutes: number;
  perPizzaMinutes: number;
  deliveryMinutes: number;
}

// Registro completo do estabelecimento (resposta de OPERATOR)
export interface StoreDTO extends StoreInfoDTO {
  createdAt: string;
  updatedAt: string;
}

export type UpdateStorePayloadDTO = Partial<
  Omit<StoreDTO, "id" | "createdAt" | "updatedAt">
>;
