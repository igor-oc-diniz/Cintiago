import type { OrderDTO, OrderStatus } from "@cintiago/shared";

export interface ActiveOrderCardProps {
  order: OrderDTO;
  progressSegment: (status: OrderStatus) => number;
  getItemHeadlines: (order: OrderDTO) => string[];
  getStatusLabel: (status: OrderStatus) => string;
  formatPrice: (value: number) => string;
  onTrack: (orderId: number) => void;
  onOpen: (orderId: number) => void;
}
