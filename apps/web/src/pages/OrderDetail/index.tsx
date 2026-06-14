import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { OrderDetailDesktop } from "@/components/templates/OrderDetailDesktop";

export default function OrderDetail() {
  const data = useOrderDetail();
  const { isMobile } = useBreakpoint();

  // Mobile version not yet designed — falls back to desktop layout
  return <OrderDetailDesktop {...data} />;
}
