import { ReactNode } from 'react'

export type ToggleContainerProps = {
  label: React.ReactNode
  children: ReactNode
  withSwitch?: boolean
  toggleAlwaysVisible?: boolean
}
