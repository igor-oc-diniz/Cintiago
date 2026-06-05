import type React from 'react'

export interface AppLayoutProps {
  children:   React.ReactNode
  bottomBar?: React.ReactNode
  showBack?:  boolean
  title?:     string
  onBack?:    () => void
  variant?:   'mobile' | 'desktop' | 'auto'
  className?: string
}
