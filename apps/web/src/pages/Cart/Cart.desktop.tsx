import { AppLayout } from '@/components/templates/AppLayout'
import { Footer } from '@/components/organisms/Footer'
import type { CartData } from './useCartData'
import { pizzaItemLabel, pizzaItemSub, pizzaItemCustomizations } from './useCartData'
import type { CartPizzaItem, CartProductItem } from '@/store/slices/cartSlice'

const chipBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px',
  borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--surface)',
  cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--fg2)',
}

function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)}
        style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border-strong)', background: 'var(--surface)', cursor: 'pointer', display: 'grid', placeItems: 'center', opacity: value <= min ? 0.4 : 1, flexShrink: 0 }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--fg1)', minWidth: 16, textAlign: 'center' }}>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}
        style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border-strong)', background: 'var(--surface)', cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
    </div>
  )
}

function PizzaCartCard({ item, onQty, onRemove, onEdit }: {
  item: CartPizzaItem; onQty: (v: number) => void; onRemove: () => void; onEdit: () => void
}) {
  const customs = pizzaItemCustomizations(item)
  return (
    <div className="cg-card cg-grain" style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: 88, height: 88, flexShrink: 0, borderRadius: 'var(--radius-lg)', background: 'radial-gradient(60% 60% at 38% 32%, #C97A45 0%, #9A4A22 55%, #5E2A12 100%)' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--fg1)', lineHeight: 1.15 }}>{pizzaItemLabel(item)}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--fg3)', marginTop: 4 }}>{pizzaItemSub(item)}</div>
          {customs.length > 0 && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg4)', marginTop: 5, lineHeight: 1.45 }}>{customs.join(' · ')}</div>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--fg1)', whiteSpace: 'nowrap' }}>
          {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
      <hr className="cg-divider" style={{ margin: '14px 0 12px' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onEdit} style={chipBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fg3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            Editar
          </button>
          <button type="button" onClick={onRemove} style={chipBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fg3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
            Remover
          </button>
        </div>
        <Stepper value={item.quantity} onChange={onQty} />
      </div>
    </div>
  )
}

function ProductCartCard({ item, onQty }: { item: CartProductItem; onQty: (v: number) => void }) {
  return (
    <div className="cg-card cg-grain" style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'center' }}>
      <div style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(150deg, #DCE6DB 0%, #A9C0A6 100%)' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--fg1)' }}>{item.productName}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg3)', marginTop: 2 }}>
          {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada
        </div>
      </div>
      <Stepper value={item.quantity} onChange={onQty} />
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg1)', minWidth: 88, textAlign: 'right' }}>
        {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>
    </div>
  )
}

function SelectorRow({ icon, label, value, placeholder, onClick }: {
  icon: React.ReactNode; label: string; value: string | null; placeholder: string; onClick: () => void
}) {
  const empty = !value
  return (
    <button type="button" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', cursor: 'pointer',
      padding: '13px 14px', borderRadius: 'var(--radius-lg)', border: 'none', background: 'var(--surface)', boxShadow: 'inset 0 0 0 1px var(--border)',
    }}>
      <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0, display: 'grid', placeItems: 'center', background: 'var(--surface-inset)' }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg4)' }}>{label}</span>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: empty ? 500 : 600, fontSize: 14.5, color: empty ? 'var(--fg4)' : 'var(--fg1)', marginTop: 2 }}>{value ?? placeholder}</span>
      </span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fg4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    </button>
  )
}

export function CartDesktop({ navigate, isLoggedIn, pizzaItems, productItems, isEmpty, subtotal, deliveryType, paymentName, deliveryLabel, fee, total, ready, formatPrice, handleQty, handleRemove }: CartData) {
  return (
    <AppLayout variant="desktop" footer={<Footer />}>
      <div className="px-12 pt-8 pb-24">
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 38, letterSpacing: '-0.01em', color: 'var(--fg1)', margin: '0 0 24px' }}>
          Seu pedido
        </h1>

        {isEmpty ? (
          <div className="cg-card" style={{ padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--surface-inset)', display: 'grid', placeItems: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--fg4)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg1)', lineHeight: 1.4, maxWidth: 360 }}>
              Sua mesa ainda está vazia. Que tal começar com uma Margherita?
            </div>
            <button type="button" onClick={() => navigate('/')} style={{ ...chipBtn, height: 48, padding: '0 22px', fontSize: 14.5, color: 'var(--primary)', borderColor: 'var(--border-strong)' }}>
              Ver o cardápio
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 384px', gap: 32, alignItems: 'start' }}>
            {/* LEFT — items */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {pizzaItems.map((item) => (
                  <PizzaCartCard
                    key={item.id}
                    item={item}
                    onQty={(v) => handleQty(item.id, v)}
                    onRemove={() => handleRemove(item.id)}
                    onEdit={() => navigate(`/pizza/${item.halves[0].pizzaId}`)}
                  />
                ))}
                {productItems.map((item) => (
                  <ProductCartCard key={item.id} item={item} onQty={(v) => handleQty(item.id, v)} />
                ))}
              </div>
              <button type="button" onClick={() => navigate('/')} style={{
                width: '100%', marginTop: 14, height: 56, borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                border: '1px dashed var(--border-strong)', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, color: 'var(--fg2)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Adicionar mais itens
              </button>
            </div>

            {/* RIGHT — sticky summary card */}
            <div className="cg-card cg-grain" style={{ position: 'sticky', top: 100, padding: 22 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, color: 'var(--fg1)', marginBottom: 16 }}>
                Resumo
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <SelectorRow
                  icon={<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--accent-warm)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>}
                  label="Entrega" value={deliveryLabel} placeholder="Selecionar forma de entrega" onClick={() => navigate('/cart/delivery')}
                />
                <SelectorRow
                  icon={<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--accent-warm)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>}
                  label="Pagamento" value={paymentName} placeholder="Selecionar forma de pagamento" onClick={() => navigate('/cart/payment')}
                />
              </div>

              <hr className="cg-divider" style={{ margin: '20px 0 16px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 14, color: 'var(--fg2)' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: 'var(--fg1)' }}>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 14, color: 'var(--fg2)' }}>Taxa de entrega</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: deliveryType === 'delivery' ? 'var(--fg1)' : 'var(--fg4)' }}>
                    {deliveryType === 'delivery' ? formatPrice(fee) : 'a definir'}
                  </span>
                </div>
                <div style={{ height: 2 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--fg1)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--fg1)' }}>{formatPrice(total)}</span>
                </div>
              </div>

              <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button type="button" disabled={!ready} onClick={() => navigate('/order/confirm')} style={{
                  width: '100%', height: 54, borderRadius: 'var(--radius-lg)', border: 'none',
                  cursor: ready ? 'pointer' : 'not-allowed',
                  background: ready ? 'var(--primary)' : 'var(--oat)',
                  color: ready ? 'var(--on-primary)' : 'var(--fg4)',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: ready ? 'var(--shadow-md)' : 'none',
                  transition: 'background var(--dur-fast) var(--ease-soft)',
                }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                  </svg>
                  Finalizar pedido
                </button>

                {!isLoggedIn && (
                  <button type="button" onClick={() => navigate('/login')} style={{
                    width: '100%', height: 50, borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                    border: '1px solid var(--border-strong)', background: 'transparent',
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, color: 'var(--fg1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--fg3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Criar cadastro
                  </button>
                )}

                {!ready && (
                  <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--fg4)', lineHeight: 1.4 }}>
                    {!deliveryType && !paymentName ? 'Escolha entrega e pagamento para finalizar'
                      : !deliveryType ? 'Escolha a forma de entrega'
                      : 'Escolha a forma de pagamento'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
