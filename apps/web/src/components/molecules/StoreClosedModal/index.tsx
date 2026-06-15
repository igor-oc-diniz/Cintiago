import { Button } from "@/components/atoms/Button";
import type { StoreClosedModalProps } from "./types";

// Modal simpático exibido quando a loja fechou entre carregar a página e
// finalizar o pedido. Segue o padrão visual do LogoutModal (cg-scrim + cg-card).
export function StoreClosedModal({
  onClose,
  openingHours,
}: StoreClosedModalProps) {
  return (
    <div
      className="cg-scrim"
      onClick={onClose}
      style={{ display: "grid", placeItems: "center" }}
    >
      <div
        className="cg-card cg-grain"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420, width: "100%", padding: 28 }}
        role="dialog"
        aria-modal="true"
      >
        <div
          style={{
            fontFamily: "var(--font-display, serif)",
            fontWeight: 600,
            fontSize: 24,
            color: "var(--fg1, #1A1410)",
            marginBottom: 8,
          }}
        >
          Poxa, acabamos de fechar 🌙
        </div>
        <p
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: 14,
            color: "var(--fg3, #7A6A5A)",
            margin: "0 0 20px",
            lineHeight: 1.5,
          }}
        >
          Nosso forno descansou por hoje e não conseguimos receber seu pedido
          agora.
          {openingHours
            ? ` Voltamos no nosso horário: ${openingHours}. Te esperamos com a massa fresquinha!`
            : " Volte no nosso horário de funcionamento que preparamos sua pizza com todo o carinho!"}
        </p>
        <Button variant="primary" fullWidth onClick={onClose}>
          Entendi
        </Button>
      </div>
    </div>
  );
}
