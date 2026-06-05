import { cn } from '@/utils/cn'
import { Button } from '@/components/atoms/Button'
import type { EmptyStateProps } from './types'

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className,
      )}
    >
      {icon && (
        <div className="h-16 w-16 flex items-center justify-center text-[var(--color-outline)] mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-display font-semibold text-xl text-[var(--color-on-surface)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="font-body text-[var(--color-on-surface-variant)] text-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
