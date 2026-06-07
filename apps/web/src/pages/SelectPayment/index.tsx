import { useBreakpoint } from "@/hooks/useBreakpoint";
import { usePaymentSelection } from "./usePaymentSelection";
import { SelectPaymentMobile } from "./SelectPayment.mobile";

export default function SelectPayment() {
  const data = usePaymentSelection();
  const { isDesktop } = useBreakpoint();

  if (isDesktop) {
    // TODO: implementar versão desktop (Screen 4b — Web, inline no Cart)
    return <SelectPaymentMobile {...data} />;
  }

  return <SelectPaymentMobile {...data} />;
}
