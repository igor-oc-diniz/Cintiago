import type { DeliveryAddress } from "@/types/domain";

export type AddressField = keyof DeliveryAddress;

export interface AddressFormProps {
  addr: DeliveryAddress;
  onFieldChange: (field: AddressField, value: string) => void;
  isCepLoading?: boolean;
}
