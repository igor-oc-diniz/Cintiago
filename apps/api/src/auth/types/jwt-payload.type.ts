export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface JwtUser {
  userId: number;
  email: string;
  role: string;
}

export interface MeResponse {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  clientId: number | null;
}
