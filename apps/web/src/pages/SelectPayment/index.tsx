import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/api/payments";
import { useCart } from "@/hooks/useCart";
import { QUERY_KEYS } from "@/lib/queryClient";
import { Spinner } from "@/components/atoms/Spinner";

export default function SelectPayment() {
  const navigate = useNavigate();
  const { paymentId, setPayment } = useCart();
  const { data: payments, isLoading } = useQuery({
    queryKey: QUERY_KEYS.payments,
    queryFn: getPayments,
  });

  const handleSelect = (id: number, name: string) => {
    setPayment(id, name);
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
          Forma de pagamento
        </h1>
      </div>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "48px 0",
          }}
        >
          <Spinner size="lg" />
        </div>
      ) : (
        <div
          style={{
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {(payments ?? []).map((p) => {
            const on = paymentId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id, p.name)}
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
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
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
                    {p.name}
                  </span>
                  {p.type && (
                    <span
                      style={{
                        display: "block",
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--fg3)",
                        marginTop: 2,
                      }}
                    >
                      {p.type}
                    </span>
                  )}
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
      )}
    </div>
  );
}
