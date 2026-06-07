import { AppLayout } from "@/components/templates/AppLayout";
import { HomeBanner } from "@/components/organisms/HomeBanner";
import { PizzaList } from "@/components/organisms/PizzaList";
import { ProductList } from "@/components/organisms/ProductList";
import { Footer } from "@/components/organisms/Footer";
import { CategoryToggle } from "@/components/molecules/CategoryToggle";
import type { HomePageProps } from "./useHomeData";

export function HomeMobile({
  activeTab,
  setActiveTab,
  pizzas,
  pizzasLoading,
  pizzasError,
  refetchPizzas,
  onPizzaClick,
  products,
  productsLoading,
  productsError,
  refetchProducts,
  onAddProduct,
}: HomePageProps) {
  return (
    <AppLayout variant="mobile" footer={<Footer />}>
      <div style={{ padding: "16px" }}>
        <HomeBanner />
      </div>
      <div style={{ padding: "0 16px" }}>
        <CategoryToggle value={activeTab} onChange={setActiveTab} />
      </div>

      {/* List */}
      <div style={{ padding: "16px 16px 0" }}>
        {activeTab === "pizzas" ? (
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
  );
}
