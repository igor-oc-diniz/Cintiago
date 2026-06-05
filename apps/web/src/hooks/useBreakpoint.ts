import { useEffect, useState } from 'react'

const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
} as const

type Breakpoint = keyof typeof BREAKPOINTS

function getMatches(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`).matches
}

export function useBreakpoint() {
  const [isDesktop, setIsDesktop] = useState(() => getMatches('lg'))
  const [isMd, setIsMd]           = useState(() => getMatches('md'))

  useEffect(() => {
    const mqLg = window.matchMedia(`(min-width: ${BREAKPOINTS.lg}px)`)
    const mqMd = window.matchMedia(`(min-width: ${BREAKPOINTS.md}px)`)

    const handleLg = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    const handleMd = (e: MediaQueryListEvent) => setIsMd(e.matches)

    mqLg.addEventListener('change', handleLg)
    mqMd.addEventListener('change', handleMd)

    return () => {
      mqLg.removeEventListener('change', handleLg)
      mqMd.removeEventListener('change', handleMd)
    }
  }, [])

  return {
    isMobile:  !isMd,
    isTablet:  isMd && !isDesktop,
    isDesktop,
  }
}
