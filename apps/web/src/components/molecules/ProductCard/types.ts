export interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  price: number;
  onAdd: () => void;
  className?: string;
}
