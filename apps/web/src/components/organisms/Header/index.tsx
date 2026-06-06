import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, ClipboardList } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Divider } from "@/components/atoms/Divider";
import { CartButton } from "@/components/molecules/CartButton";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import type { HeaderProps } from "./types";

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          flexShrink: 0,
          background:
            "linear-gradient(160deg, var(--terracotta-600), var(--terracotta-800))",
          boxShadow: "var(--shadow-xs)",
          position: "relative",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 4px, rgba(250,243,226,0.5) 4px 5px)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 16,
            color: "var(--parchment)",
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
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 21,
          color: "var(--fg1)",
          letterSpacing: "-0.01em",
        }}
      >
        Cintiago
      </span>
    </div>
  );
}

function StoreStatus({ isOpen = true }: { isOpen?: boolean }) {
  return (
    <span className="cg-status" style={{ paddingLeft: 39 }}>
      <span
        className={`cg-dot ${isOpen ? "cg-dot--open" : "cg-dot--closed"}`}
      />
      {isOpen ? "Aberto até 23h" : "Fechado · abre às 18h"}
    </span>
  );
}

export function Header({ showBack, title, onBack, className }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuth();
  const { count: cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleLogout = () => {
    if (window.confirm("Deseja sair da sua conta?")) {
      logout();
      setDropdownOpen(false);
    }
  };

  return (
    <header
      className={cn(className)}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        padding: "12px 16px 10px",
        background: "color-mix(in oklab, var(--parchment) 88%, transparent)",
        backdropFilter: "blur(12px) saturate(150%)",
        WebkitBackdropFilter: "blur(12px) saturate(150%)",
        boxShadow: "0 1px 0 var(--border)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Left */}
        {showBack ? (
          <button
            type="button"
            onClick={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              boxShadow: "var(--shadow-xs)",
              flexShrink: 0,
            }}
            aria-label="Voltar"
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
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              minWidth: 0,
            }}
          >
            <Logo />
            <StoreStatus isOpen />
          </div>
        )}

        {/* Center title */}
        {title && (
          <span
            className="absolute left-1/2 -translate-x-1/2 font-body font-semibold"
            style={{ color: "var(--fg1)" }}
          >
            {title}
          </span>
        )}

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => navigate("/cart")}
              aria-label="Carrinho"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                boxShadow: "var(--shadow-xs)",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    padding: "0 5px",
                    borderRadius: 999,
                    background: "var(--primary)",
                    color: "var(--on-primary)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: 11,
                    lineHeight: "18px",
                    textAlign: "center",
                    boxShadow: "0 0 0 2px var(--parchment)",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {isLoggedIn && user ? (
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  padding: 4,
                  background: "var(--basil-100)",
                  border: "none",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
                aria-label="Menu do usuário"
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
              </button>
              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: 184,
                    background: "var(--surface)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-lg), 0 0 0 1px var(--border)",
                    padding: 6,
                    zIndex: 50,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <button
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 10px",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      fontSize: 14,
                      color: "var(--fg1)",
                    }}
                    onClick={() => {
                      navigate("/orders");
                      setDropdownOpen(false);
                    }}
                  >
                    <ClipboardList size={16} color="var(--fg3)" /> Meus pedidos
                  </button>
                  <button
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 10px",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      fontSize: 14,
                      color: "var(--fg1)",
                    }}
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                  >
                    <User size={16} color="var(--fg3)" /> Meu perfil
                  </button>
                  <Divider />
                  <button
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 10px",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      fontSize: 14,
                      color: "var(--color-error)",
                    }}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login", { state: { from: location } })}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-strong)",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 14,
                color: "var(--fg2)",
              }}
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
