import { AppLayout } from "@/components/templates/AppLayout";
import { Footer } from "@/components/organisms/Footer";
import { formatPrice } from "@/utils/format";
import { PizzaImageFallback } from "@/components/atoms/PizzaImageFallback";
import { CrustSelector } from "@/components/molecules/CrustSelector";
import { PizzaSection } from "@/components/molecules/PizzaSection";
import { SizeSelector } from "@/components/molecules/SizeSelector";
import { Stepper } from "@/components/molecules/Stepper";
import { HalfBlock } from "@/components/organisms/HalfBlock";
import { NotesField } from "@/components/molecules/NotesField";
import type { PizzaDetailData } from "./usePizzaDetailData";

export function PizzaDetailDesktop({
  pizza,
  crusts,
  allPizzas,
  selectedSize,
  setSelectedSize,
  selectedCrustId,
  setSelectedCrustId,
  qty,
  setQty,
  isMeia,
  secondPizzaId,
  setSecondPizzaId,
  addedIds,
  notes,
  setNotes,
  secondPizza,
  total,
  defaultIngs,
  addonIngs,
  secondDefaultIngs,
  secondAddonIngs,
  toggleAdded,
  enableMeia,
  disableMeia,
  handleAddToCart,
  confirmLabel,
  navigate,
}: PizzaDetailData) {
  if (!pizza) return null;

  const meia = isMeia && !!secondPizza;

  return (
    <AppLayout variant="desktop" footer={<Footer />}>
      <div style={{ padding: "24px 0 96px" }}>
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 14,
            color: "var(--fg3)",
            padding: "4px 0",
            marginBottom: 18,
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Voltar ao cardápio
        </button>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "440px 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* LEFT — sticky image + info */}
          <div style={{ position: "sticky", top: 100 }}>
            <div className="cg-card" style={{ padding: 0, overflow: "hidden" }}>
              {meia ? (
                <div
                  style={{ position: "relative", display: "flex", height: 300 }}
                >
                  {pizza.imageUrl ? (
                    <img
                      src={pizza.imageUrl}
                      alt={pizza.name}
                      style={{ flex: 1, height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <PizzaImageFallback
                      half="first"
                      style={{ flex: 1, height: "100%" }}
                    />
                  )}
                  {secondPizza.imageUrl ? (
                    <img
                      src={secondPizza.imageUrl}
                      alt={secondPizza.name}
                      style={{ flex: 1, height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <PizzaImageFallback
                      half="second"
                      style={{ flex: 1, height: "100%" }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "50%",
                      width: 2,
                      transform: "translateX(-1px)",
                      background: "rgba(253,249,239,0.5)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: 14,
                      bottom: 14,
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      color: "var(--parchment)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 12.5,
                      background: "rgba(38,30,20,0.4)",
                      padding: "6px 12px",
                      borderRadius: 999,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    Meia a meia
                  </div>
                </div>
              ) : pizza.imageUrl ? (
                <img
                  src={pizza.imageUrl}
                  alt={pizza.name}
                  style={{
                    width: "100%",
                    height: 340,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <PizzaImageFallback
                  half="first"
                  withOverlays
                  style={{ height: 340 }}
                />
              )}
            </div>
            <div style={{ padding: "20px 4px 0" }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 30,
                  lineHeight: 1.12,
                  letterSpacing: "-0.01em",
                  color: "var(--fg1)",
                  margin: "0 0 8px",
                }}
              >
                {meia ? `${pizza.name} / ${secondPizza.name}` : pizza.name}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--fg3)",
                  margin: 0,
                }}
              >
                {meia
                  ? `Metade ${pizza.name}, metade ${secondPizza.name}. Personalize cada lado abaixo.`
                  : pizza.description}
              </p>
            </div>
          </div>

          {/* RIGHT — configuration */}
          <div>
            {/* Tamanho */}
            <PizzaSection title="Tamanho" required>
              <SizeSelector
                pizza={pizza}
                secondPizza={secondPizza}
                isMeia={isMeia}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
              />
            </PizzaSection>
            <hr className="cg-divider" style={{ marginBottom: 26 }} />

            {/* Borda */}
            {crusts.length > 0 && (
              <>
                <PizzaSection title="Borda" note="opcional">
                  <CrustSelector
                    crusts={crusts}
                    selectedCrustId={selectedCrustId}
                    selectedSize={selectedSize}
                    onSelect={setSelectedCrustId}
                  />
                </PizzaSection>
                <hr className="cg-divider" style={{ marginBottom: 26 }} />
              </>
            )}

            {/* Meia a meia */}
            <PizzaSection title="Meia a meia" note="opcional">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--surface)",
                  boxShadow: "inset 0 0 0 1px var(--border)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--fg1)",
                    }}
                  >
                    Quero dois sabores
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--fg3)",
                    }}
                  >
                    {meia
                      ? `2ª metade: ${secondPizza.name}`
                      : "Escolha um segundo sabor — vale o preço do mais caro"}
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isMeia}
                  onClick={() => (isMeia ? disableMeia() : enableMeia())}
                  style={{
                    width: 52,
                    height: 31,
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                    position: "relative",
                    background: isMeia
                      ? "var(--success)"
                      : "var(--line-strong)",
                    transition: "background var(--dur-base) var(--ease-soft)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: isMeia ? 24 : 3,
                      width: 25,
                      height: 25,
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "var(--shadow-sm)",
                      transition: "left var(--dur-base) var(--ease-soft)",
                    }}
                  />
                </button>
              </div>

              {/* Inline second flavor picker — no sheet on desktop */}
              {isMeia && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 10,
                    marginTop: 14,
                  }}
                >
                  {allPizzas
                    .filter((p) => p.id !== pizza.id)
                    .map((p) => {
                      const on = secondPizzaId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSecondPizzaId(p.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 11,
                            padding: 10,
                            borderRadius: "var(--radius-lg)",
                            cursor: "pointer",
                            background: on
                              ? "var(--primary-soft)"
                              : "var(--surface)",
                            textAlign: "left",
                            boxShadow: on
                              ? "inset 0 0 0 1.5px var(--primary)"
                              : "inset 0 0 0 1px var(--border)",
                            border: "none",
                          }}
                        >
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              flexShrink: 0,
                              borderRadius: "var(--radius-md)",
                              overflow: "hidden",
                              background: "var(--oat)",
                            }}
                          >
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <PizzaImageFallback
                                style={{ width: "100%", height: "100%" }}
                              />
                            )}
                          </div>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span
                              style={{
                                display: "block",
                                fontFamily: "var(--font-display)",
                                fontWeight: 600,
                                fontSize: 15.5,
                                color: "var(--fg1)",
                              }}
                            >
                              {p.name}
                            </span>
                            <span
                              style={{
                                display: "block",
                                fontFamily: "var(--font-body)",
                                fontSize: 12,
                                color: "var(--fg4)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {p.description}
                            </span>
                          </span>
                          {on && (
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--primary)"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}
            </PizzaSection>
            <hr className="cg-divider" style={{ marginBottom: 26 }} />

            {/* Personalizar */}
            <PizzaSection title="Personalizar">
              {meia && (
                <div className="cg-note" style={{ marginBottom: 18 }}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--gold-800)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>
                    Adicionais valem para a pizza inteira. O mesmo ingrediente
                    nas duas metades é cobrado uma vez só.
                  </span>
                </div>
              )}
              {meia ? (
                <div style={{ display: "flex", gap: 28 }}>
                  <HalfBlock
                    label="1ª metade"
                    pizzaName={pizza.name}
                    defaultIngs={defaultIngs}
                    addonIngs={addonIngs}
                    addedIds={addedIds[0]}
                    onAdd={(id) => toggleAdded(0, id)}
                  />
                  <div
                    style={{
                      width: 1,
                      background: "var(--border)",
                      backgroundImage:
                        "repeating-linear-gradient(180deg, var(--border) 0 4px, transparent 4px 8px)",
                      flexShrink: 0,
                    }}
                  />
                  <HalfBlock
                    label="2ª metade"
                    pizzaName={secondPizza.name}
                    defaultIngs={secondDefaultIngs}
                    addonIngs={secondAddonIngs}
                    addedIds={addedIds[1]}
                    onAdd={(id) => toggleAdded(1, id)}
                  />
                </div>
              ) : (
                <div style={{ maxWidth: 520 }}>
                  <HalfBlock
                    pizzaName={pizza.name}
                    defaultIngs={defaultIngs}
                    addonIngs={addonIngs}
                    addedIds={addedIds[0]}
                    onAdd={(id) => toggleAdded(0, id)}
                  />
                </div>
              )}
            </PizzaSection>
            <hr className="cg-divider" style={{ marginBottom: 26 }} />

            {/* Observações */}
            <PizzaSection
              title="Observações"
              note="Ex: sem cebola, bem assada…"
            >
              <div style={{ maxWidth: 520 }}>
                <NotesField value={notes} onChange={setNotes} />
              </div>
            </PizzaSection>
            <hr className="cg-divider" style={{ marginBottom: 26 }} />

            {/* Quantidade */}
            <PizzaSection title="Quantidade">
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Stepper value={qty} onChange={setQty} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13.5,
                    color: "var(--fg3)",
                  }}
                >
                  {qty > 1 ? `${qty} pizzas` : "pizza"}
                </span>
              </div>
            </PizzaSection>
          </div>
        </div>
      </div>

      {/* Sticky order bar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          background: "color-mix(in oklab, var(--parchment) 92%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 -1px 0 var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 36px",
            height: 84,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12.5,
                color: "var(--fg4)",
              }}
            >
              Total
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 28,
                color: "var(--fg1)",
                whiteSpace: "nowrap",
              }}
            >
              {formatPrice(total)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            style={{
              minWidth: 280,
              height: 52,
              borderRadius: "var(--radius-lg)",
              border: "none",
              cursor: "pointer",
              background: "var(--primary)",
              color: "var(--on-primary)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              boxShadow: "var(--shadow-md)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {confirmLabel}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
