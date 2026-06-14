import type { ReactNode } from "react";

export type TimelineNodeState = "done" | "active" | "todo";

export interface HTimelineStage {
  key: string;
  label: string;
  icon: ReactNode;
  timestamp?: string | null;
}

export interface HTimelineProps {
  stages: HTimelineStage[];
  activeIndex: number;
  isDelivered: boolean;
}
