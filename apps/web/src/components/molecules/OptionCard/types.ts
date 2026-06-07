import type { ReactNode } from "react";

export interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}
