export type Role = 'CLIENT' | 'OPERATOR';

export interface MeDTO {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: Role;
  clientId: number | null;
}
