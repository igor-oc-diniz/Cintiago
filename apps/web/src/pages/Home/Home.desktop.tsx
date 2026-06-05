import { AppLayout }   from '@/components/templates/AppLayout'
import { PizzaList }   from '@/components/organisms/PizzaList'
import { ProductList } from '@/components/organisms/ProductList'
import { Footer }      from '@/components/organisms/Footer'
import { Tag }         from '@/components/atoms/Tag'
import type { HomePageProps } from './useHomeData'

export function HomeDesktop({
  activeTab, setActiveTab,
  pizzas, pizzasLoading, pizzasError, refetchPizzas, onPizzaClick,
  products, productsLoading, productsError, refetchProducts, onAddProduct,
}: HomePageProps) {
  return (
    <AppLayout variant="desktop">
      <div className="max-w-screen-xl mx-auto px-12 py-8">

        {/* Toggle de tabs */}
        <div className="flex gap-3 mb-8">
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

        {/* Listagem — grid com mais colunas no desktop */}
        {activeTab === 'pizzas' ? (
          <PizzaList
            pizzas={pizzas}
            isLoading={pizzasLoading}
            isError={pizzasError}
            onRetry={refetchPizzas}
            onPizzaClick={onPizzaClick}
            columns={4}
          />
        ) : (
          <ProductList
            products={products}
            isLoading={productsLoading}
            isError={productsError}
            onRetry={refetchProducts}
            onAdd={onAddProduct}
            columns={3}
          />
        )}
      </div>

      <Footer />
    </AppLayout>
  )
}
