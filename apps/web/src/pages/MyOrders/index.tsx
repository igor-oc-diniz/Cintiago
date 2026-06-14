import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useMyOrders } from "@/hooks/useMyOrders";
import { MyOrdersMobile } from "@/components/templates/MyOrdersMobile";
import { MyOrdersDesktop } from "@/components/templates/MyOrdersDesktop";

export default function MyOrders() {
  const data = useMyOrders();
  const { isMobile } = useBreakpoint();

  return isMobile ? (
    <MyOrdersMobile {...data} />
  ) : (
    <MyOrdersDesktop {...data} />
  );
}
