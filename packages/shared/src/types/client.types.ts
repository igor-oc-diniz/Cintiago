export interface ClientDTO {
  id: number;
  userId: number;
  phone: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  zipCode: string;
  createdAt: string;
}

export interface CreateClientPayloadDTO {
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

export type UpdateClientPayloadDTO = Partial<CreateClientPayloadDTO>;
