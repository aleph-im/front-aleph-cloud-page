import { ReactNode } from 'react'

export type CenteredContainerVariant = 'default' | 'dashboard'

export type CenteredContainerProps = {
  children: ReactNode
  variant?: CenteredContainerVariant
}
