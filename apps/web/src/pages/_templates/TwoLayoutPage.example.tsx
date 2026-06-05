// Exemplo de página com dois layouts.
// Copie e adapte para cada página que precisar de .mobile + .desktop

import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useExampleData } from './useExampleData.example'
import { ExampleMobile } from './Example.mobile'
import { ExampleDesktop } from './Example.desktop'

export default function Example() {
  const data = useExampleData()       // toda a lógica aqui
  const { isDesktop } = useBreakpoint()

  return isDesktop
    ? <ExampleDesktop {...data} />
    : <ExampleMobile {...data} />
}
