import type { OrderDTO, OrderStatus } from "@cintiago/shared";

export interface ActiveOrderCardDesktopProps {
  order: OrderDTO;
  progressSegment: (status: OrderStatus) => number;
  getItemHeadlines: (order: OrderDTO) => string[];
  getStatusLabel: (status: OrderStatus) => string;
  formatPrice: (value: number) => string;
  onTrack: (id: number) => void;
  onOpen: (id: number) => void;
}
