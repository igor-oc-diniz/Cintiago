import { useBreakpoint } from "@/hooks/useBreakpoint";

export function NotesField({
  value,
  onChange,
  placeholder = "Ex: sem cebola, capricha no orégano…",
  maxLength = 500,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const { isDesktop } = useBreakpoint();

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      placeholder={placeholder}
      maxLength={maxLength}
      aria-label="Observações do item"
      className="cg-input"
      style={{
        width: "100%",
        height: "auto",
        minHeight: 80,
        padding: "13px 15px",
        resize: "vertical",
        lineHeight: 1.5,
        fontFamily: "var(--font-body, sans-serif)",
        fontSize: isDesktop ? 14 : 14.5,
        boxSizing: "border-box",
      }}
    />
  );
}
