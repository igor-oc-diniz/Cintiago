import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useOrderConfirm } from "@/hooks/useOrderConfirm";
import { OrderConfirmMobile } from "@/components/templates/OrderConfirmMobile";

export default function OrderConfirm() {
  const data = useOrderConfirm();
  const { isMobile } = useBreakpoint();

  // Desktop version not yet designed — falls back to mobile layout
  return <OrderConfirmMobile {...data} />;
}
