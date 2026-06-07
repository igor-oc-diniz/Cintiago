import type { ReactNode } from "react";
import type { IconTileTone } from "@/components/atoms/IconTile/types";

export interface CardHeadProps {
  icon: ReactNode;
  tone: IconTileTone;
  title: string;
  sub: string;
  on: boolean;
}
