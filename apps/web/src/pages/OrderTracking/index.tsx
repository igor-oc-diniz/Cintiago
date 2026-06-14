import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { OrderTrackingMobile } from "@/components/templates/OrderTrackingMobile";
import { OrderTrackingDesktop } from "@/components/templates/OrderTrackingDesktop";

export default function OrderTracking() {
  const data = useOrderTracking();
  const { isMobile } = useBreakpoint();

  return isMobile ? (
    <OrderTrackingMobile {...data} />
  ) : (
    <OrderTrackingDesktop {...data} />
  );
}
