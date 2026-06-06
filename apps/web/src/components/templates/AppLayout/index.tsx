import { cn } from "@/utils/cn";
import { Header } from "@/components/organisms/Header";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import type { AppLayoutProps } from "./types";

export function AppLayout({
  children,
  footer,
  bottomBar,
  showBack,
  title,
  onBack,
  variant = "auto",
  className,
}: AppLayoutProps) {
  const { isDesktop } = useBreakpoint();

  const isWide = variant === "desktop" || (variant === "auto" && isDesktop);

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Header showBack={showBack} title={title} onBack={onBack} />
      <main
        className={cn(
          "pt-0",
          bottomBar ? "pb-24" : "pb-0",
          isWide ? "max-w-screen-xl mx-auto w-full" : "max-w-md mx-auto w-full",
          className,
        )}
      >
        {children}
      </main>
      {footer}
      {bottomBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40">{bottomBar}</div>
      )}
    </div>
  );
}
