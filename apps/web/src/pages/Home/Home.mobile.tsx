import { AppLayout }   from '@/components/templates/AppLayout'
import { PizzaList }   from '@/components/organisms/PizzaList'
import { ProductList } from '@/components/organisms/ProductList'
import { Footer }      from '@/components/organisms/Footer'
import { Tag }         from '@/components/atoms/Tag'
import type { HomePageProps } from './useHomeData'

export function HomeMobile({
  activeTab, setActiveTab,
  pizzas, pizzasLoading, pizzasError, refetchPizzas, onPizzaClick,
  products, productsLoading, productsError, refetchProducts, onAddProduct,
}: HomePageProps) {
  return (
    <AppLayout variant="mobile">
      {/* Toggle de tabs */}
      <div className="flex gap-2 px-4 pt-4 pb-2 sticky top-14 z-30
                      bg-[var(--color-background)] border-b
                      border-[var(--color-bamboo-accent)]">
        <Tag
          label="Pizzas"
          active={activeTab === 'pizzas'}
          onClick={() => setActiveTab('pizzas')}
        />
        <Tag
          label="Extras"
          active={activeTab === 'extras'}
          onClick={() => setActiveTab('extras')}
        />
      </div>

      {/* Listagem */}
      <div className="px-4 py-4">
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
          />
        )}
      </div>

      <Footer />
    </AppLayout>
  )
}
