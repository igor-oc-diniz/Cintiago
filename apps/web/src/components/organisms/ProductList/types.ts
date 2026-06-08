import { ProductDTO } from "@cintiago/shared";

export interface ProductListProps {
  products: ProductDTO[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onAdd: (product: ProductDTO) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}
