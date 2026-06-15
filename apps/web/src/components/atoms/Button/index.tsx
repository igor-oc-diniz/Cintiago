import { cn } from "@/utils/cn";
import { Spinner } from "@/components/atoms/Spinner";
import type { ButtonProps } from "./types";

const variantClasses = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-tint)] active:translate-y-px shadow-artisan-sm",
  secondary:
    "border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary-fixed)] bg-transparent",
  ghost: "border-0 bg-transparent text-[var(--color-on-surface)]",
  icon: "border border-[var(--border)] bg-[var(--surface)] text-[var(--color-on-surface)] rounded-full !p-0 w-10 h-10",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded font-body font-semibold transition-all cursor-pointer active:scale-95",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        (disabled || loading) &&
          "opacity-40 cursor-not-allowed active:scale-100",
        loading && "pointer-events-none",
        className,
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
