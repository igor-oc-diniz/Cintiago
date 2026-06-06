import { useBreakpoint }  from '@/hooks/useBreakpoint'
import { useCartData }    from './useCartData'
import { CartMobile }     from './Cart.mobile'
import { CartDesktop }    from './Cart.desktop'

export default function Cart() {
  const data          = useCartData()
  const { isDesktop } = useBreakpoint()

  return isDesktop
    ? <CartDesktop {...data} />
    : <CartMobile  {...data} />
}
