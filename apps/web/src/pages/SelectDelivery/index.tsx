import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const OPTIONS = [
  {
    type: "delivery" as const,
    label: "Delivery",
    note: "Entrega na sua casa · 30–45 min",
  },
  {
    type: "pickup" as const,
    label: "Retirar no balcão",
    note: "Pronto em ~20 min · Rua das Oliveiras, 112",
  },
  {
    type: "dine_in" as const,
    label: "Comer no salão",
    note: "Mesa no salão de bambu",
  },
];

const ICONS: Record<string, React.ReactNode> = {
  delivery: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent-warm)"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  pickup: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent-warm)"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  dine_in: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent-warm)"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
    </svg>
  ),
};

export default function SelectDelivery() {
  const navigate = useNavigate();
  const { deliveryType, setDelivery } = useCart();

  const handleSelect = (type: "delivery" | "pickup" | "dine_in") => {
    setDelivery(type);
    navigate(-1);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "16px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 24,
            color: "var(--fg1)",
            margin: 0,
          }}
        >
          Forma de entrega
        </h1>
      </div>

      <div
        style={{
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {OPTIONS.map((opt) => {
          const on = deliveryType === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => handleSelect(opt.type)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                padding: "16px",
                borderRadius: "var(--radius-xl)",
                border: "none",
                background: on ? "var(--primary-soft)" : "var(--surface)",
                boxShadow: on
                  ? "inset 0 0 0 2px var(--primary), var(--shadow-xs)"
                  : "inset 0 0 0 1px var(--border), var(--shadow-xs)",
                transition: "all var(--dur-fast) var(--ease-soft)",
              }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-lg)",
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  background: on
                    ? "var(--terracotta-100)"
                    : "var(--surface-inset)",
                }}
              >
                {ICONS[opt.type]}
              </span>
              <span style={{ flex: 1 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: on ? "var(--primary)" : "var(--fg1)",
                  }}
                >
                  {opt.label}
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--fg3)",
                    marginTop: 2,
                  }}
                >
                  {opt.note}
                </span>
              </span>
              {on && (
                <svg
                  width="20"
                  height="20"
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
  );
}
