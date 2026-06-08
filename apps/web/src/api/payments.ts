import { api } from "./client";
import type { PaymentDTO } from "@cintiago/shared";

export const getPayments = () =>
  api.get<PaymentDTO[]>("/payments").then((r) => r.data);
