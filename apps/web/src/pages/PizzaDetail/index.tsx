import { useBreakpoint }       from '@/hooks/useBreakpoint'
import { usePizzaDetailData }  from './usePizzaDetailData'
import { PizzaDetailMobile }   from './PizzaDetail.mobile'
import { PizzaDetailDesktop }  from './PizzaDetail.desktop'

export default function PizzaDetail() {
  const data          = usePizzaDetailData()
  const { isDesktop } = useBreakpoint()

  if (data.isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', placeItems: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (!data.pizza) return null

  return isDesktop
    ? <PizzaDetailDesktop {...data} />
    : <PizzaDetailMobile  {...data} />
}
