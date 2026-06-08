import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { OrderTrackingMobile } from "@/components/templates/OrderTrackingMobile";

export default function OrderTracking() {
  const data = useOrderTracking();
  const { isMobile } = useBreakpoint();

  // Desktop version not yet designed — falls back to mobile layout
  return <OrderTrackingMobile {...data} />;
}
