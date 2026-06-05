import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, LogOut, User, ClipboardList } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Avatar } from '@/components/atoms/Avatar'
import { Button } from '@/components/atoms/Button'
import { Divider } from '@/components/atoms/Divider'
import { CartButton } from '@/components/molecules/CartButton'
import { StoreStatusBadge } from '@/components/molecules/StoreStatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import type { HeaderProps } from './types'

export function Header({ showBack, title, onBack, className }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoggedIn, logout } = useAuth()
  const { count: cartCount } = useCart()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  const handleLogout = () => {
    if (window.confirm('Deseja sair da sua conta?')) {
      logout()
      setDropdownOpen(false)
    }
  }

  return (
    <header
      className={cn(
        'bg-[var(--color-surface-lowest)] border-b border-[var(--color-bamboo-accent)] sticky top-0 z-40',
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left */}
        <div className="flex flex-col justify-center">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center text-[var(--color-on-surface)] p-1 -ml-1"
              aria-label="Voltar"
            >
              <ChevronLeft size={24} />
            </button>
          ) : (
            <>
              <span className="font-display font-bold text-lg text-[var(--color-primary)] leading-none">
                Cintiago
              </span>
              <StoreStatusBadge isOpen className="mt-0.5" />
            </>
          )}
        </div>

        {/* Center */}
        {title && (
          <span className="absolute left-1/2 -translate-x-1/2 font-body font-semibold text-[var(--color-on-surface)]">
            {title}
          </span>
        )}

        {/* Right */}
        <div className="flex items-center gap-1">
          <CartButton
            count={cartCount}
            onClick={() => navigate('/cart')}
          />
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="p-1"
                aria-label="Menu do usuário"
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--color-surface-lowest)] border border-[var(--color-bamboo-accent)] rounded-lg shadow-[var(--shadow)] overflow-hidden z-50">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-body text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)]"
                    onClick={() => { navigate('/orders'); setDropdownOpen(false) }}
                  >
                    <ClipboardList size={16} />
                    Meus pedidos
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-body text-[var(--color-on-surface)] hover:bg-[var(--color-surface-high)]"
                    onClick={() => { navigate('/profile'); setDropdownOpen(false) }}
                  >
                    <User size={16} />
                    Meu perfil
                  </button>
                  <Divider />
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-body text-[var(--color-error)] hover:bg-[var(--color-surface-high)]"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login', { state: { from: location } })}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
