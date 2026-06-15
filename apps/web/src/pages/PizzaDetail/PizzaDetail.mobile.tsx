import { formatPrice } from "@/utils/format";
import { PizzaImageFallback } from "@/components/atoms/PizzaImageFallback";
import { CrustSelector } from "@/components/molecules/CrustSelector";
import { PizzaSection } from "@/components/molecules/PizzaSection";
import { SizeSelector } from "@/components/molecules/SizeSelector";
import { Stepper } from "@/components/molecules/Stepper";
import { HalfBlock } from "@/components/organisms/HalfBlock";
import { NotesField } from "@/components/molecules/NotesField";
import { InfoTooltip } from "@/components/atoms/InfoTooltip";
import type { PizzaDetailData } from "./usePizzaDetailData";

const MEIA_PRICE_TOOLTIP =
  "No meia a meia, o preço cobrado é o da pizza mais cara entre as duas metades. Se a 2ª metade for mais cara que a 1ª, a diferença é acrescentada ao total.";

export function PizzaDetailMobile({
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
  sheetOpen,
  setSheetOpen,
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

  const firstSizePrice =
    pizza.prices.find((p) => p.size === selectedSize)?.price ?? 0;

  const secondSizePrice =
    secondPizza?.prices.find((p) => p.size === selectedSize)?.price ?? 0;

  const priceDiff = secondPizza ? secondSizePrice - firstSizePrice : 0;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      <div
        className="cg-noscroll"
        style={{ overflowY: "auto", paddingBottom: 110 }}
      >
        {/* Full-bleed image */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", width: "100%", height: 232 }}>
            {pizza.imageUrl ? (
              <img
                src={pizza.imageUrl}
                alt={pizza.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  flex: 1,
                }}
              />
            ) : (
              <PizzaImageFallback
                half="first"
                withOverlays
                style={{ flex: 1, height: "100%" }}
              />
            )}
            {isMeia && secondPizza && (
              <>
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
              </>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(38,30,20,0.5), transparent 42%)",
            }}
          />
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            style={{
              position: "absolute",
              top: 16,
              left: 14,
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              background:
                "color-mix(in oklab, var(--parchment) 82%, transparent)",
              backdropFilter: "blur(8px)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--fg1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          {isMeia && (
            <div
              style={{
                position: "absolute",
                left: 16,
                bottom: 12,
                display: "flex",
                gap: 6,
                alignItems: "center",
                color: "var(--parchment)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 12.5,
                background: "rgba(38,30,20,0.34)",
                padding: "5px 11px",
                borderRadius: 999,
                backdropFilter: "blur(4px)",
              }}
            >
              Meia a meia
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "18px 16px 16px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 28,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "var(--fg1)",
              margin: "0 0 4px",
            }}
          >
            {isMeia && secondPizza
              ? `${pizza.name} / ${secondPizza.name}`
              : pizza.name}
          </h1>
          {!isMeia && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--fg3)",
                margin: 0,
              }}
            >
              {pizza.description}
            </p>
          )}
        </div>

        <hr className="cg-divider" style={{ margin: "0 16px" }} />

        {/* Size */}
        <div style={{ padding: "18px 0" }}>
          <PizzaSection title="Tamanho" required>
            <SizeSelector
              pizza={pizza}
              secondPizza={secondPizza}
              isMeia={isMeia}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          </PizzaSection>
        </div>

        {/* Crust */}
        {crusts.length > 0 && (
          <>
            <hr className="cg-divider" style={{ margin: "0 16px" }} />
            <div style={{ padding: "18px 0" }}>
              <PizzaSection title="Borda" note="opcional">
                <CrustSelector
                  crusts={crusts}
                  selectedCrustId={selectedCrustId}
                  selectedSize={selectedSize}
                  onSelect={setSelectedCrustId}
                />
              </PizzaSection>
            </div>
          </>
        )}

        {/* Meia a meia */}
        <hr className="cg-divider" style={{ margin: "0 16px" }} />
        <div style={{ padding: "18px 0" }}>
          <PizzaSection title="Meia a meia" note="opcional">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 14px",
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
                    fontSize: 14,
                    color: "var(--fg1)",
                  }}
                >
                  Quero meia a meia
                </div>

                {isMeia && secondPizza ? (
                  <div style={{ marginTop: 3 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--fg3)",
                      }}
                    >
                      2ª metade: {secondPizza.name}
                    </div>
                    {secondPizza.description && (
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--fg4)",
                          marginTop: 1,
                        }}
                      >
                        {secondPizza.description}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 3,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 700,
                          fontSize: 12,
                          color: "var(--success)",
                        }}
                      >
                        {priceDiff > 0
                          ? `+ ${formatPrice(priceDiff)}`
                          : "Grátis"}
                      </span>
                      <InfoTooltip text={MEIA_PRICE_TOOLTIP} />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--fg3)",
                      marginTop: 2,
                    }}
                  >
                    Escolha um segundo sabor
                  </div>
                )}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isMeia}
                onClick={() => (isMeia ? disableMeia() : enableMeia())}
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  position: "relative",
                  background: isMeia ? "var(--success)" : "var(--line-strong)",
                  transition: "background var(--dur-base) var(--ease-soft)",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: isMeia ? 23 : 3,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "var(--shadow-sm)",
                    transition: "left var(--dur-base) var(--ease-soft)",
                  }}
                />
              </button>
            </div>
            {isMeia && (
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--primary)",
                  padding: "2px 2px",
                }}
              >
                {secondPizza ? "Trocar 2ª metade" : "Escolher 2ª metade"}
              </button>
            )}
          </PizzaSection>
        </div>

        {/* Customization */}
        <hr className="cg-divider" style={{ margin: "0 16px" }} />
        <div style={{ padding: "18px 0" }}>
          <PizzaSection title="Personalizar">
            {isMeia && (
              <div className="cg-note" style={{ marginBottom: 14 }}>
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
                  Adicionais valem para a pizza inteira. O mesmo ingrediente nas
                  duas metades é cobrado uma vez só.
                </span>
              </div>
            )}
            {isMeia && secondPizza ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <HalfBlock
                  label="1ª metade"
                  pizzaName={pizza.name}
                  defaultIngs={defaultIngs}
                  addonIngs={addonIngs}
                  addedIds={addedIds[0]}
                  onAdd={(id) => toggleAdded(0, id)}
                  crossHalfIds={addedIds[1]}
                  isPrimary
                />
                <hr className="cg-divider" />
                <HalfBlock
                  label="2ª metade"
                  pizzaName={secondPizza.name}
                  defaultIngs={secondDefaultIngs}
                  addonIngs={secondAddonIngs}
                  addedIds={addedIds[1]}
                  onAdd={(id) => toggleAdded(1, id)}
                  crossHalfIds={addedIds[0]}
                />
              </div>
            ) : (
              <HalfBlock
                pizzaName={pizza.name}
                defaultIngs={defaultIngs}
                addonIngs={addonIngs}
                addedIds={addedIds[0]}
                onAdd={(id) => toggleAdded(0, id)}
              />
            )}
          </PizzaSection>
        </div>

        {/* Observações */}
        <hr className="cg-divider" style={{ margin: "0 16px" }} />
        <div style={{ padding: "18px 0 8px" }}>
          <PizzaSection title="Observações" note="Ex: sem cebola…">
            <NotesField value={notes} onChange={setNotes} />
          </PizzaSection>
        </div>

        {/* Quantity */}
        <hr className="cg-divider" style={{ margin: "0 16px" }} />
        <div style={{ padding: "18px 0 8px" }}>
          <PizzaSection title="Quantidade">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 2px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13.5,
                  color: "var(--fg3)",
                }}
              >
                Quantas pizzas?
              </span>
              <Stepper value={qty} onChange={setQty} />
            </div>
          </PizzaSection>
        </div>
      </div>

      {/* Fixed footer */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 25,
          padding: "14px 16px 28px",
          background: "color-mix(in oklab, var(--parchment) 90%, transparent)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 -1px 0 var(--border)",
        }}
      >
        <button
          type="button"
          onClick={handleAddToCart}
          style={{
            width: "100%",
            height: 54,
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
          {confirmLabel}
          <span style={{ opacity: 0.55, margin: "0 2px" }}>·</span>
          {formatPrice(total)}
        </button>
      </div>

      {/* Second flavor picker sheet */}
      {sheetOpen && (
        <div className="cg-scrim" onClick={() => setSheetOpen(false)}>
          <div
            className="cg-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxHeight: "min(74%, 560px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "0 2px 12px" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 21,
                  color: "var(--fg1)",
                }}
              >
                Segundo sabor
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--fg3)",
                  marginTop: 2,
                }}
              >
                A metade atual continua sendo a 1ª.
              </div>
            </div>
            <div
              className="cg-noscroll"
              style={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                paddingBottom: 4,
              }}
            >
              {allPizzas
                .filter((p) => p.id !== pizza.id)
                .map((p) => {
                  const on = secondPizzaId === p.id;
                  const pPrice =
                    p.prices.find((pr) => pr.size === selectedSize)?.price ?? 0;
                  const diff = pPrice - firstSizePrice;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSecondPizzaId(p.id);
                        setSheetOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        width: "100%",
                        textAlign: "left",
                        cursor: "pointer",
                        padding: 10,
                        borderRadius: "var(--radius-lg)",
                        border: "none",
                        background: on
                          ? "var(--primary-soft)"
                          : "var(--surface)",
                        boxShadow: on
                          ? "inset 0 0 0 1.5px var(--primary)"
                          : "inset 0 0 0 1px var(--border)",
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
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
                            fontSize: 16,
                            color: "var(--fg1)",
                          }}
                        >
                          {p.name}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: 12,
                            color: "var(--success)",
                          }}
                        >
                          {diff > 0 ? `+ ${formatPrice(diff)}` : "Grátis"}
                          <InfoTooltip text={MEIA_PRICE_TOOLTIP} />
                        </span>
                      </span>
                      {on && (
                        <svg
                          width="18"
                          height="18"
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
          </div>
        </div>
      )}
    </div>
  );
}
