import { useState } from "react";
import { StarRating } from "@/components/molecules/StarRating";
import { Button } from "@/components/atoms/Button";
import { LeafIcon, CheckIcon } from "@/components/atoms/Icons";
import type { RatingCardProps } from "./types";

export function RatingCard({
  existingRating,
  localRating,
  onSubmit,
}: RatingCardProps) {
  const submitted = existingRating ?? localRating;
  const [stars, setStars] = useState(submitted?.stars ?? 0);
  const [comment, setComment] = useState(submitted?.comment ?? "");
  const [sent, setSent] = useState(Boolean(submitted));

  const handleSubmit = () => {
    if (stars === 0) return;
    setSent(true);
    onSubmit({ stars, comment });
  };

  return (
    <div
      className="cg-card cg-grain"
      style={{ padding: 24, position: "relative" }}
    >
      <LeafIcon
        size={17}
        color="var(--basil-300, #A8C5A0)"
        style={{
          position: "absolute",
          top: 18,
          right: 20,
          opacity: 0.75,
          strokeWidth: 1.8,
          zIndex: 3,
        }}
      />

      {!sent ? (
        <>
          <div
            style={{
              fontFamily: "var(--font-display, serif)",
              fontWeight: 600,
              fontSize: 22,
              color: "var(--fg1, #1A1410)",
            }}
          >
            Como foi seu pedido?
          </div>
          <p
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 14,
              color: "var(--fg3, #7A6A5A)",
              margin: "5px 0 18px",
              lineHeight: 1.5,
              maxWidth: 460,
            }}
          >
            Sua avaliação ajuda a gente a cuidar da próxima fornada.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <StarRating value={stars} onChange={setStars} size="md" />
            <span
              style={{
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 13.5,
                color: "var(--fg4, #B0A090)",
              }}
            >
              {stars > 0 ? `${stars} de 5` : "Toque para avaliar"}
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Conte como foi (opcional)"
            className="cg-input"
            style={{
              width: "100%",
              height: "auto",
              minHeight: 84,
              padding: "13px 15px",
              resize: "vertical",
              lineHeight: 1.5,
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 14.5,
              margin: "16px 0",
              boxSizing: "border-box",
            }}
          />

          <Button
            variant="primary"
            size="sm"
            disabled={stars === 0}
            onClick={handleSubmit}
          >
            Enviar avaliação
          </Button>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                fontFamily: "var(--font-display, serif)",
                fontWeight: 600,
                fontSize: 22,
                color: "var(--fg1, #1A1410)",
                whiteSpace: "nowrap",
              }}
            >
              Sua avaliação
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 12.5,
                fontWeight: 600,
                color: "var(--basil-700, #3D6B43)",
              }}
            >
              <CheckIcon
                size={14}
                strokeWidth={2.6}
                color="var(--basil-600, #4D7B53)"
              />
              Enviada
            </span>
          </div>

          <div style={{ padding: "14px 0 4px" }}>
            <StarRating value={stars} size="md" />
          </div>

          {comment && (
            <p
              style={{
                fontFamily: "var(--font-display, serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 17,
                color: "var(--fg2, #3A2E24)",
                margin: "10px 0 0",
                lineHeight: 1.5,
                maxWidth: 560,
              }}
            >
              "{comment}"
            </p>
          )}

          {existingRating?.reply && (
            <div
              style={{
                marginTop: 18,
                maxWidth: 620,
                background: "var(--basil-50, #F0F7F1)",
                borderRadius: 10,
                padding: "14px 16px",
                borderLeft: "3px solid var(--basil-300, #A8C5A0)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 7,
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    background: "var(--terracotta-700, #8B3318)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display, serif)",
                      fontWeight: 800,
                      fontSize: 13,
                      color: "var(--parchment, #FAF3E2)",
                    }}
                  >
                    C
                  </span>
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--basil-900, #1A3B1E)",
                  }}
                >
                  Resposta da Cintiago
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body, sans-serif)",
                  fontSize: 14.5,
                  color: "var(--basil-900, #1A3B1E)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {existingRating.reply}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
