export function HomeBanner() {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 130% at 80% 10%, #E9A86B 0%, #C9572E 42%, #7C2614 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(95deg, rgba(38,20,12,0.74) 0%, rgba(38,20,12,0.32) 52%, transparent 78%)",
        }}
      />
      <div
        className="web-bamboo"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: 90,
          opacity: 0.18,
        }}
      />
      <div
        style={{ position: "relative", padding: "54px 56px", maxWidth: 620 }}
      >
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 12.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--gold-200)",
            marginBottom: 16,
          }}
        >
          Do forno a lenha
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 50,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: "var(--parchment)",
            margin: "0 0 18px",
            maxWidth: 460,
          }}
        >
          Feita do jeito{" "}
          <span style={{ fontStyle: "italic", fontWeight: 600 }}>devagar</span>.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.6,
            color: "rgba(253,249,239,0.84)",
            margin: 0,
            maxWidth: 440,
          }}
        >
          Massa de fermentação natural, descansada 48 horas e assada em forno a
          lenha a 450°C. Monte seu pedido abaixo.
        </p>
      </div>
    </div>
  );
}
