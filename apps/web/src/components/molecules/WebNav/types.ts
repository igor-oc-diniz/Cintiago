export interface WebNavProps {
  active?: "orders" | "profile";
  userName: string;
  userEmail: string;
  userInitials: string;
  onHome: () => void;
  onOrders: () => void;
  onProfile: () => void;
}
