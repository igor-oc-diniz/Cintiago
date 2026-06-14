import { useState } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { ReceiptIcon, UserRoundIcon } from "@/components/atoms/Icons";
import type { WebNavProps } from "./types";

export function WebNav({
  active,
  userName,
  userEmail,
  onHome,
  onOrders,
  onProfile,
}: WebNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background:
          "color-mix(in oklab, var(--parchment, #FAF3E2) 84%, transparent)",
        backdropFilter: "blur(14px) saturate(150%)",
        WebkitBackdropFilter: "blur(14px) saturate(150%)",
        boxShadow: "0 1px 0 var(--border, #E8E0D0)",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 36px",
          height: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* Logo + status */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button
            onClick={onHome}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 11,
            }}
            aria-label="Ir para o início"
          >
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                flex: "none",
                background:
                  "linear-gradient(160deg, var(--terracotta-600, #C0522A), var(--terracotta-800, #8B3318))",
                display: "grid",
                placeItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display, serif)",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "var(--parchment, #FAF3E2)",
                  position: "relative",
                  lineHeight: 1,
                  paddingTop: 1,
                }}
              >
                C
              </span>
            </span>
            <span
              style={{
                fontFamily: "var(--font-display, serif)",
                fontWeight: 700,
                fontSize: 24,
                color: "var(--fg1, #1A1410)",
                letterSpacing: "-0.01em",
              }}
            >
              Cintiago
            </span>
          </button>
          <span
            style={{
              width: 1,
              height: 26,
              background: "var(--border, #E8E0D0)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#22c55e",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 13,
                color: "var(--fg3, #7A6A5A)",
              }}
            >
              Aberto até 23h
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onOrders}
            style={{
              height: 44,
              padding: "0 18px",
              borderRadius: 999,
              cursor: "pointer",
              border:
                active === "orders"
                  ? "1px solid var(--primary, #C0522A)"
                  : "1px solid var(--border-strong, #D4C8B8)",
              background:
                active === "orders"
                  ? "var(--primary-soft, rgba(192,82,42,0.1))"
                  : "var(--surface, #FFFFFF)",
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontFamily: "var(--font-body, sans-serif)",
              fontWeight: 600,
              fontSize: 14.5,
              color:
                active === "orders"
                  ? "var(--primary, #C0522A)"
                  : "var(--fg1, #1A1410)",
            }}
          >
            <ReceiptIcon size={18} />
            Meus pedidos
          </button>

          {/* Avatar dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu da conta"
              aria-expanded={menuOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                borderRadius: "50%",
                boxShadow:
                  active === "profile"
                    ? "0 0 0 2px var(--primary, #C0522A)"
                    : "none",
              }}
            >
              <Avatar name={userName} size="md" />
            </button>

            {menuOpen && (
              <>
                <div
                  onClick={() => setMenuOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 40 }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: 230,
                    background: "var(--surface, #FFFFFF)",
                    borderRadius: 12,
                    boxShadow:
                      "0 10px 40px rgba(0,0,0,0.14), 0 0 0 1px var(--border, #E8E0D0)",
                    padding: 8,
                    zIndex: 41,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      padding: "8px 10px 12px",
                    }}
                  >
                    <Avatar name={userName} size="sm" />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-body, sans-serif)",
                          fontWeight: 600,
                          fontSize: 14,
                          color: "var(--fg1, #1A1410)",
                        }}
                      >
                        {userName}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body, sans-serif)",
                          fontSize: 12,
                          color: "var(--fg3, #7A6A5A)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {userEmail}
                      </div>
                    </div>
                  </div>

                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid var(--border, #E8E0D0)",
                      margin: "0 4px 4px",
                    }}
                  />

                  {[
                    {
                      icon: <UserRoundIcon size={17} color="var(--fg3)" />,
                      label: "Meu perfil",
                      action: () => {
                        setMenuOpen(false);
                        onProfile();
                      },
                    },
                    {
                      icon: <ReceiptIcon size={17} color="var(--fg3)" />,
                      label: "Meus pedidos",
                      action: () => {
                        setMenuOpen(false);
                        onOrders();
                      },
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        width: "100%",
                        textAlign: "left",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 8,
                        padding: "11px 10px",
                        fontFamily: "var(--font-body, sans-serif)",
                        fontWeight: 500,
                        fontSize: 14,
                        color: "var(--fg1, #1A1410)",
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
