import type { ReactNode } from "react";

export interface MetaRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}
