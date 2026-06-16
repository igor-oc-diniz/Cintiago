// Métodos de pagamento — evita comparar com o literal "CASH" etc.
// O tipo PaymentType vem de @cintiago/shared / types/domain.
export const PAYMENT_TYPE = {
  cash: "CASH",
  credit: "CREDIT",
  debit: "DEBIT",
  pix: "PIX",
} as const;
