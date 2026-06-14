import type { ReactNode } from "react";

export interface ProfileShortcutProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}
