import { AppLayout } from "@/components/templates/AppLayout";
import { PizzaList } from "@/components/organisms/PizzaList";
import { ProductList } from "@/components/organisms/ProductList";
import { Footer } from "@/components/organisms/Footer";
import { HomeBanner } from "@/components/organisms/HomeBanner";
import { CategoryToggle } from "@/components/molecules/CategoryToggle";
import type { HomePageProps } from "./useHomeData";

export function HomeDesktop({
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
    <AppLayout variant="desktop" footer={<Footer />}>
      <div className="px-12 pt-8 pb-24">
        <HomeBanner />

        {/* Section header: eyebrow + title + toggle, all centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            margin: "36px 0 24px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--fg4)",
                marginBottom: 7,
              }}
            >
              O cardápio
            </div>
            <CategoryToggle value={activeTab} onChange={setActiveTab} />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 32,
                color: "var(--fg1)",
                margin: 0,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {activeTab === "pizzas" ? "Nossas pizzas" : "Para acompanhar"}
            </h2>
          </div>
        </div>

        {activeTab === "pizzas" ? (
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
  );
}
