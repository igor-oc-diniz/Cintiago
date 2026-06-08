import { useEffect, useState } from "react";

export function CheckAnimation() {
  const [play, setPlay] = useState(false);

  // Double-rAF ensures the CSS transition fires even on throttled timelines.
  // Without this guard the animation never triggers on slow/paused frames.
  useEffect(() => {
    let a: number, b: number;
    a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setPlay(true));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, []);

  return (
    <svg
      className={`cg-check${play ? " cg-check--play" : ""}`}
      width="76"
      height="76"
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="36"
        cy="36"
        r="33"
        stroke="var(--success)"
        strokeOpacity="0.18"
        strokeWidth="3"
      />
      <circle
        className="cg-check__ring"
        cx="36"
        cy="36"
        r="33"
        stroke="var(--success)"
        strokeWidth="3"
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
      <path
        className="cg-check__tick"
        d="M22 37.5 L31.5 47 L51 26"
        stroke="var(--success)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
