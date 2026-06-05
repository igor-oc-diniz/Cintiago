import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useHomeData }   from './useHomeData'
import { HomeMobile }    from './Home.mobile'
import { HomeDesktop }   from './Home.desktop'

export default function Home() {
  const data          = useHomeData()
  const { isDesktop } = useBreakpoint()

  return isDesktop
    ? <HomeDesktop {...data} />
    : <HomeMobile  {...data} />
}
