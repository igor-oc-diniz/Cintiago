import { DeliverySelectionMobile } from "@/components/templates/DeliverySelectionMobile";
import type { DeliverySelectionData } from "./useDeliverySelection";

export function SelectDeliveryMobile(props: DeliverySelectionData) {
  return <DeliverySelectionMobile {...props} />;
}
