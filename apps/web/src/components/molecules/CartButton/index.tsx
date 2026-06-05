import { ShoppingCart } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { CartButtonProps } from './types'

export function CartButton({ count, onClick, className }: CartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('relative cursor-pointer p-2', className)}
      aria-label={`Carrinho com ${count} ${count === 1 ? 'item' : 'itens'}`}
    >
      <ShoppingCart size={24} className="text-[var(--color-on-surface)]" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
