import { cn } from '@/utils/cn'
import type { FormFieldProps } from './types'

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-sm font-semibold font-body text-[var(--color-on-surface-variant)]">
        {label}
        {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
      {!error && hint && (
        <p className="text-xs text-[var(--color-on-surface-variant)]">{hint}</p>
      )}
    </div>
  )
}
