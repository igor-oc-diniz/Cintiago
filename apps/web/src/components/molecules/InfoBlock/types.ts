import type { ReactNode } from "react";

export interface InfoBlockProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
}
