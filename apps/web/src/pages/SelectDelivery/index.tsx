import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useDeliverySelection } from "./useDeliverySelection";
import { SelectDeliveryMobile } from "./SelectDelivery.mobile";

export default function SelectDelivery() {
  const data = useDeliverySelection();
  const { isDesktop } = useBreakpoint();

  if (isDesktop) {
    // TODO: implementar versão desktop (Screen 4a — Web)
    return null;
  }

  return <SelectDeliveryMobile {...data} />;
}
