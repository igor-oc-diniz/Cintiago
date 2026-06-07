import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import {
  ADDRESS_DEFAULT,
  DELIVERY_ETA,
  DELIVERY_FEE,
  PIZZERIA,
} from "@/constants/delivery";
import type { DeliveryAddress } from "@/types/domain";

export type DeliveryOption = "delivery" | "pickup";

export interface DeliverySelectionData {
  sel: DeliveryOption;
  setSel: (option: DeliveryOption) => void;
  editing: boolean;
  toggleEditing: () => void;
  addr: DeliveryAddress;
  onFieldChange: (field: keyof DeliveryAddress, value: string) => void;
  line1: string;
  line2: string;
  deliveryEta: string;
  deliveryFee: string;
  pizzeria: typeof PIZZERIA;
  handleConfirm: () => void;
  handleBack: () => void;
}

export function useDeliverySelection(): DeliverySelectionData {
  const navigate = useNavigate();
  const { deliveryType, setDelivery } = useCart();

  const [sel, setSel] = useState<DeliveryOption>(
    deliveryType === "pickup" ? "pickup" : "delivery",
  );
  const [editing, setEditing] = useState(false);
  const [addr, setAddr] = useState<DeliveryAddress>(ADDRESS_DEFAULT);

  const onFieldChange = (field: keyof DeliveryAddress, value: string) => {
    setAddr((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditing = () => setEditing((v) => !v);

  const line1 = `${addr.rua}, ${addr.number}${addr.complement ? " · " + addr.complement : ""}`;
  const line2 = `${addr.neighborhood} · ${addr.city}`;

  const deliveryFee = `R$ ${DELIVERY_FEE.toFixed(2).replace(".", ",")}`;

  const handleConfirm = () => {
    setDelivery(sel);
    navigate(-1);
  };

  const handleBack = () => navigate(-1);

  return {
    sel,
    setSel: (option) => {
      setSel(option);
      if (option === "pickup") setEditing(false);
    },
    editing,
    toggleEditing,
    addr,
    onFieldChange,
    line1,
    line2,
    deliveryEta: DELIVERY_ETA,
    deliveryFee,
    pizzeria: PIZZERIA,
    handleConfirm,
    handleBack,
  };
}
