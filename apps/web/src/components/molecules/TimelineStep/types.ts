import type { ReactNode } from "react";

export type TimelineStepState = "done" | "active" | "todo";

export interface TimelineStepProps {
  icon: ReactNode;
  label: string;
  timestamp?: string | null;
  state: TimelineStepState;
  isLast?: boolean;
}
