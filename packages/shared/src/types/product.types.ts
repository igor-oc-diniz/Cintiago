export interface ProductDTO {
  id: number;
  name: string;
  description: string | null;
  price: string;
  active: boolean;
  createdAt: string;
}
