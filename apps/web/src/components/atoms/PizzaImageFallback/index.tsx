interface PizzaImageFallbackProps {
  half?: "first" | "second";
  withOverlays?: boolean;
  style?: React.CSSProperties;
}

const GRADIENT: Record<"first" | "second", string> = {
  first:
    "radial-gradient(60% 60% at 38% 32%, #C97A45 0%, #9A4A22 55%, #5E2A12 100%)",
  second:
    "radial-gradient(60% 60% at 62% 32%, #D9683F 0%, #A8331F 56%, #6E1E10 100%)",
};

export function PizzaImageFallback({
  half = "first",
  withOverlays = false,
  style,
}: PizzaImageFallbackProps) {
  return (
    <div style={{ background: GRADIENT[half], position: "relative", ...style }}>
      {withOverlays && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(70% 60% at 30% 24%, rgba(255,246,230,0.32), transparent 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 -18px 32px rgba(60,30,12,0.28)",
            }}
          />
        </>
      )}
    </div>
  );
}
