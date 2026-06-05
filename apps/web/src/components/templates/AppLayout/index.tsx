import { cn } from '@/utils/cn'
import { Header } from '@/components/organisms/Header'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import type { AppLayoutProps } from './types'

export function AppLayout({
  children,
  bottomBar,
  showBack,
  title,
  onBack,
  variant = 'auto',
  className,
}: AppLayoutProps) {
  const { isDesktop } = useBreakpoint()

  const isWide = variant === 'desktop' || (variant === 'auto' && isDesktop)

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header showBack={showBack} title={title} onBack={onBack} />
      <main
        className={cn(
          'pt-0 pb-24',
          isWide ? 'max-w-screen-xl mx-auto' : 'max-w-md mx-auto',
          className,
        )}
      >
        {children}
      </main>
      {bottomBar && (
        <div className={cn(
          'fixed bottom-0 left-0 right-0 z-40',
          isWide ? 'max-w-screen-xl mx-auto' : 'max-w-md mx-auto',
        )}>
          {bottomBar}
        </div>
      )}
    </div>
  )
}
