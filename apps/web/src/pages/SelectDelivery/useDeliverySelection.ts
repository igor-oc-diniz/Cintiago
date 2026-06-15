import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { ADDRESS_DEFAULT } from "@/constants/delivery";
import { formatPrice, formatEtaMinutes } from "@/utils/format";
import type { DeliveryAddress } from "@/types/domain";

export type DeliveryOption = "delivery" | "pickup";

export interface Pizzeria {
  address: string;
  neighborhood: string;
  ready: string;
}

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
  pizzeria: Pizzeria;
  handleConfirm: () => void;
  handleBack: () => void;
}

export function useDeliverySelection(): DeliverySelectionData {
  const navigate = useNavigate();
  const { items, deliveryType, setDelivery } = useCart();
  const {
    deliveryFee: storeDeliveryFee,
    addressLines,
    computeEtaMinutes,
  } = useStoreInfo();

  const pizzaCount = items
    .filter((i) => i.type === "pizza")
    .reduce((acc, i) => acc + i.quantity, 0);

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

  const deliveryFee = formatPrice(storeDeliveryFee);

  const pizzeria: Pizzeria = {
    address: addressLines?.line1 ?? "",
    neighborhood: addressLines?.line2 ?? "",
    ready: formatEtaMinutes(computeEtaMinutes(pizzaCount, "pickup")),
  };

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
    deliveryEta: formatEtaMinutes(computeEtaMinutes(pizzaCount, "delivery")),
    deliveryFee,
    pizzeria,
    handleConfirm,
    handleBack,
  };
}
