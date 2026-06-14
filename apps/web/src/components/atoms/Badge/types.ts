import type React from "react";

export type BadgeVariant =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivering"
  | "delivered"
  | "cancelled"
  | "vegetarian"
  | "new"
  | "spicy";

export interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
}
