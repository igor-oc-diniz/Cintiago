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
