import { PaymentSelectionMobile } from "@/components/templates/PaymentSelectionMobile";
import type { PaymentSelectionData } from "./usePaymentSelection";

export function SelectPaymentMobile(props: PaymentSelectionData) {
  return <PaymentSelectionMobile {...props} />;
}
