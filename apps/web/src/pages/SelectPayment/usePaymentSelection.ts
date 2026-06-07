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

export function usePaymentSelection(): PaymentSelectionData {
  const navigate = useNavigate();
  const { paymentId, setPayment } = useCart();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.payments,
    queryFn: getPayments,
  });

  const [selectedId, setSelectedId] = useState<number | null>(
    paymentId ?? null,
  );
  const [troco, setTroco] = useState("");

  const handleSelect = (id: number, name: string) => {
    setSelectedId(id);
    setPayment(id, name);
    if (id !== selectedId) setTroco("");
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
