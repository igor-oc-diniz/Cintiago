import { clsx } from "clsx";

interface SpinnerProps {
  size?: "sm" | "md";
}

export function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={clsx(
        "animate-spin rounded-full border-2 border-primary border-t-transparent",
        size === "md" ? "h-8 w-8" : "h-5 w-5",
      )}
    />
  );
}

// Centered variant used by route fallbacks and session-check states.
export function FullPageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Spinner />
    </div>
  );
}
