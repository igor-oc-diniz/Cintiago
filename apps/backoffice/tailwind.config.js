// tailwind.config.js
// Cintiago Backoffice — Design System Tokens
// Initial copy of apps/web/tailwind.config.js (may diverge as the
// backoffice develops its own visual identity).

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // ─── Colors ────────────────────────────────────────────────────────────
      colors: {
        // Surfaces / Neutrals (Parchment family)
        surface: {
          DEFAULT: "#f1eee4",
          dim: "#dddad0",
          bright: "#fdf9ef",
          lowest: "#ffffff",
          low: "#f7f3e9",
          high: "#ece8de",
          highest: "#e6e2d8",
        },
        "on-surface": "#1c1c16",
        "on-surface-variant": "#58413e",
        "inverse-surface": "#31312a",
        "inverse-on-surface": "#f4f0e7",
        outline: "#8b716c",
        "outline-variant": "#dfbfba",

        // Primary — Terracotta Red
        primary: {
          DEFAULT: "#922719",
          tint: "#a83727",
          container: "#b33f2e",
          on: "#ffffff",
          "on-container": "#ffded8",
          inverse: "#ffb4a7",
          fixed: "#ffdad4",
          "fixed-dim": "#ffb4a7",
          "on-fixed": "#400200",
          "on-fixed-variant": "#872012",
        },

        // Secondary — Basil Green
        secondary: {
          DEFAULT: "#4d6545",
          container: "#cfebc2",
          on: "#ffffff",
          "on-container": "#536b4a",
          fixed: "#cfebc2",
          "fixed-dim": "#b3cea7",
          "on-fixed": "#0b2007",
          "on-fixed-variant": "#364d2f",
        },

        // Tertiary — Bamboo Gold
        tertiary: {
          DEFAULT: "#6a4800",
          container: "#875f11",
          on: "#ffffff",
          "on-container": "#ffe1b7",
          fixed: "#ffdead",
          "fixed-dim": "#f2be69",
          "on-fixed": "#281900",
          "on-fixed-variant": "#604100",
        },

        // Error
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          on: "#ffffff",
          "on-container": "#93000a",
        },

        // Background
        background: "#fdf9ef",
        "on-background": "#1c1c16",
        "surface-variant": "#e6e2d8",

        // Semantic shortcuts (for direct use in components)
        terracotta: "#922719",
        parchment: "#fdf9ef",
        basil: "#4d6545",
        bamboo: "#6a4800",
        "bamboo-gold": "#875f11",
        charcoal: "#2d2926",
      },

      // ─── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Be Vietnam Pro"', "system-ui", "sans-serif"],
      },

      fontSize: {
        "headline-lg": ["40px", { lineHeight: "48px", fontWeight: "700" }],
        "headline-lg-mobile": [
          "32px",
          { lineHeight: "38px", fontWeight: "700" },
        ],
        "headline-md": ["28px", { lineHeight: "34px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": [
          "12px",
          { lineHeight: "16px", fontWeight: "600", letterSpacing: "0.05em" },
        ],
      },

      // ─── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },

      // ─── Spacing ───────────────────────────────────────────────────────────
      spacing: {
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "48px",
      },

      maxWidth: {
        container: "1200px",
      },

      // ─── Box Shadow ────────────────────────────────────────────────────────
      boxShadow: {
        "artisan-sm": "0 2px 8px rgba(74, 50, 31, 0.05)",
        artisan: "0 4px 20px rgba(74, 50, 31, 0.05)",
        "artisan-lg": "0 8px 32px rgba(74, 50, 31, 0.08)",
      },

      // ─── Border ────────────────────────────────────────────────────────────
      borderColor: {
        "bamboo-accent": "rgba(135, 95, 17, 0.30)",
      },
    },
  },
  plugins: [],
};
