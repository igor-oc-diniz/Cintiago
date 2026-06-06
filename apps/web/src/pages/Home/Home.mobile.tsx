import { AppLayout }    from '@/components/templates/AppLayout'
import { PizzaList }    from '@/components/organisms/PizzaList'
import { ProductList }  from '@/components/organisms/ProductList'
import { Footer }       from '@/components/organisms/Footer'
import type { HomePageProps } from './useHomeData'

export function HomeMobile({
  activeTab, setActiveTab,
  pizzas, pizzasLoading, pizzasError, refetchPizzas, onPizzaClick,
  products, productsLoading, productsError, refetchProducts, onAddProduct,
}: HomePageProps) {
  return (
    <AppLayout variant="mobile" footer={<Footer />}>

      {/* Headline section */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="mr-eyebrow" style={{ marginBottom: 6 }}>Do forno a lenha</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30,
          lineHeight: 1.06, letterSpacing: '-0.02em', color: 'var(--fg1)',
          margin: '0 0 16px',
        }}>
          Feita do jeito{' '}
          <span style={{ fontStyle: 'italic', fontWeight: 600 }}>devagar</span>.
        </h1>

        {/* Category toggle */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 4,
          background: 'var(--surface-inset)', borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-inset)',
        }}>
          {(['pizzas', 'extras'] as const).map((tab) => {
            const on = activeTab === tab
            const label = tab === 'pizzas' ? 'Pizzas' : 'Extras'
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  height: 42, borderRadius: 'var(--radius-full)', border: 'none',
                  cursor: 'pointer',
                  background: on ? 'var(--surface)' : 'transparent',
                  color: on ? 'var(--fg1)' : 'var(--fg3)',
                  fontFamily: 'var(--font-body)', fontWeight: on ? 700 : 600, fontSize: 15,
                  boxShadow: on ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--dur-fast) var(--ease-soft)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '16px 16px 0' }}>
        {activeTab === 'pizzas' ? (
          <PizzaList
            pizzas={pizzas}
            isLoading={pizzasLoading}
            isError={pizzasError}
            onRetry={refetchPizzas}
            onPizzaClick={onPizzaClick}
          />
        ) : (
          <ProductList
            products={products}
            isLoading={productsLoading}
            isError={productsError}
            onRetry={refetchProducts}
            onAdd={onAddProduct}
            columns={1}
          />
        )}
      </div>

    </AppLayout>
  )
}
