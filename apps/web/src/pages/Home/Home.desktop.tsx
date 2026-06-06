import { AppLayout }   from '@/components/templates/AppLayout'
import { PizzaList }   from '@/components/organisms/PizzaList'
import { ProductList } from '@/components/organisms/ProductList'
import { Footer }      from '@/components/organisms/Footer'
import type { HomePageProps } from './useHomeData'

function HomeBanner() {
  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 130% at 80% 10%, #E9A86B 0%, #C9572E 42%, #7C2614 100%)',
      }} />
      {/* Dark overlay on left for text legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(95deg, rgba(38,20,12,0.74) 0%, rgba(38,20,12,0.32) 52%, transparent 78%)' }} />
      {/* Bamboo stripe on right */}
      <div className="web-bamboo" style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 90, opacity: 0.18 }} />
      {/* Content */}
      <div style={{ position: 'relative', padding: '54px 56px', maxWidth: 620 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-200)', marginBottom: 16 }}>
          Do forno a lenha
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 50, lineHeight: 1.08, letterSpacing: '-0.02em', color: 'var(--parchment)', margin: '0 0 18px', maxWidth: 460 }}>
          Feita do jeito <span style={{ fontStyle: 'italic', fontWeight: 600 }}>devagar</span>.
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'rgba(253,249,239,0.84)', margin: 0, maxWidth: 440 }}>
          Massa de fermentação natural, descansada 48 horas e assada em forno a lenha a 450°C. Monte seu pedido abaixo.
        </p>
      </div>
    </div>
  )
}

function CategoryToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{
      display: 'inline-grid', gridTemplateColumns: '1fr 1fr', gap: 4,
      padding: 4, background: 'var(--surface-inset)',
      borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-inset)',
    }}>
      {['Pizzas', 'Extras'].map((o) => {
        const on = value === o
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            style={{
              height: 44, padding: '0 30px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
              background: on ? 'var(--surface)' : 'transparent',
              color: on ? 'var(--fg1)' : 'var(--fg3)',
              fontFamily: 'var(--font-body)', fontWeight: on ? 700 : 600, fontSize: 15,
              boxShadow: on ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--dur-fast) var(--ease-soft)',
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export function HomeDesktop({
  activeTab, setActiveTab,
  pizzas, pizzasLoading, pizzasError, refetchPizzas, onPizzaClick,
  products, productsLoading, productsError, refetchProducts, onAddProduct,
}: HomePageProps) {
  return (
    <AppLayout variant="desktop" footer={<Footer />}>
      <div className="px-12 pt-8 pb-24">

        {/* Hero banner */}
        <HomeBanner />

        {/* Section header: eyebrow + title on left, toggle on right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, margin: '36px 0 24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg4)', marginBottom: 7 }}>
              O cardápio
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--fg1)', margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              {activeTab === 'pizzas' ? 'Nossas pizzas' : 'Para acompanhar'}
            </h2>
          </div>
          <CategoryToggle
            value={activeTab === 'pizzas' ? 'Pizzas' : 'Extras'}
            onChange={(v) => setActiveTab(v === 'Pizzas' ? 'pizzas' : 'extras')}
          />
        </div>

        {/* Listagem */}
        {activeTab === 'pizzas' ? (
          <PizzaList
            pizzas={pizzas}
            isLoading={pizzasLoading}
            isError={pizzasError}
            onRetry={refetchPizzas}
            onPizzaClick={onPizzaClick}
            variant="grid"
            columns={3}
          />
        ) : (
          <ProductList
            products={products}
            isLoading={productsLoading}
            isError={productsError}
            onRetry={refetchProducts}
            onAdd={onAddProduct}
            columns={4}
          />
        )}
      </div>
    </AppLayout>
  )
}
