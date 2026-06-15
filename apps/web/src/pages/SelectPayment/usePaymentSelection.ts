import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/api/payments";
import { useCart } from "@/hooks/useCart";
import { QUERY_KEYS } from "@/lib/queryClient";
import type { Payment } from "@/types/domain";

export interface PaymentSelectionData {
  payments: Payment[];
  isLoading: boolean;
  selectedId: number | null;
  troco: string;
  setTroco: (value: string) => void;
  handleSelect: (id: number, name: string) => void;
  handleConfirm: () => void;
  handleBack: () => void;
}

// "R$ 12,50" → 12.5 (null se vazio/ inválido)
function parseTroco(value: string): number | null {
  const cleaned = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) && num > 0 ? num : null;
}

export function usePaymentSelection(): PaymentSelectionData {
  const navigate = useNavigate();
  const { paymentId, changeFor, setPayment, setChangeFor } = useCart();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.payments,
    queryFn: getPayments,
  });

  const [selectedId, setSelectedId] = useState<number | null>(
    paymentId ?? null,
  );
  // String local só para o input; o valor numérico vive no cart (changeFor)
  const [troco, setTrocoInput] = useState<string>(
    changeFor != null ? String(changeFor).replace(".", ",") : "",
  );

  const setTroco = (value: string) => {
    setTrocoInput(value);
    setChangeFor(parseTroco(value));
  };

  const handleSelect = (id: number, name: string) => {
    setSelectedId(id);
    setPayment(id, name); // o slice zera o changeFor quando o método muda
    if (id !== selectedId) setTrocoInput("");
  };

  const handleConfirm = () => navigate(-1);
  const handleBack = () => navigate(-1);

  return {
    payments,
    isLoading,
    selectedId,
    troco,
    setTroco,
    handleSelect,
    handleConfirm,
    handleBack,
  };
}
