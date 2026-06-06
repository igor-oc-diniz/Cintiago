import { MapPin, Clock, Phone } from "lucide-react";

function FooterColumn({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-md)",
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: "rgba(250,243,226,0.1)",
        }}
      >
        {icon}
      </span>
      <div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 11.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--gold-200)",
            marginBottom: 5,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "rgba(253,249,239,0.82)",
            lineHeight: 1.55,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

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
          color: "var(--parchment)",
          letterSpacing: "-0.01em",
        }}
      >
        Cintiago
      </span>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "var(--basil-900)", marginTop: 72 }}>
      <div className="web-bamboo" style={{ height: 12 }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 36px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr 1fr 1fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          <div>
            <Logo />
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 17,
                color: "rgba(253,249,239,0.9)",
                lineHeight: 1.45,
                margin: "16px 0 0",
                maxWidth: 280,
              }}
            >
              Uma cantina de bambu, fogo vivo e tempo.
            </p>
          </div>
          <FooterColumn
            icon={<MapPin size={19} color="var(--gold-200)" />}
            title="Endereço"
          >
            Rua das Oliveiras, 112
            <br />
            Vila Madalena · São Paulo, SP
          </FooterColumn>
          <FooterColumn
            icon={<Clock size={19} color="var(--gold-200)" />}
            title="Horário"
          >
            Terça a domingo · 18h–23h
            <br />
            Segunda fechado
          </FooterColumn>
          <FooterColumn
            icon={<Phone size={19} color="var(--gold-200)" />}
            title="Contato"
          >
            (11) 4002-8922
            <br />
            olá@cintiago.com.br
          </FooterColumn>
        </div>
      </div>
    </footer>
  );
}
