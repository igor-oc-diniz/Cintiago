import type { OrderDTO, OrderStatus } from "@cintiago/shared";

export interface PastOrderCardProps {
  order: OrderDTO;
  getItemHeadlines: (order: OrderDTO) => string[];
  getStatusLabel: (status: OrderStatus) => string;
  formatPrice: (value: number) => string;
  onOpen: (orderId: number) => void;
  onRepeat: (order: OrderDTO) => void;
}
