import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { OrderDetailDesktop } from "@/components/templates/OrderDetailDesktop";
import { OrderDetailMobile } from "@/components/templates/OrderDetailMobile";

export default function OrderDetail() {
  const data = useOrderDetail();
  const { isMobile } = useBreakpoint();

  return isMobile ? (
    <OrderDetailMobile {...data} />
  ) : (
    <OrderDetailDesktop {...data} />
  );
}
