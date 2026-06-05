import { cn } from '@/utils/cn'
import { Tag } from '@/components/atoms/Tag'
import type { CategoryFilterProps } from './types'

export function CategoryFilter({
  categories,
  active,
  onChange,
  className,
}: CategoryFilterProps) {
  const all = 'Todas'
  const items = [all, ...categories]

  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-none',
        className,
      )}
    >
      {items.map((cat) => (
        <Tag
          key={cat}
          label={cat}
          active={active === cat}
          onClick={() => onChange(cat)}
        />
      ))}
    </div>
  )
}
