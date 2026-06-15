export type PaymentType = "CASH" | "CREDIT" | "DEBIT" | "PIX";

export interface PaymentDTO {
  id: number;
  name: string;
  type: PaymentType;
  active: boolean;
}
