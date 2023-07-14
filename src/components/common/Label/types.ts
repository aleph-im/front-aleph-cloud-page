import { HTMLAttributes } from 'react'

export type LabelVariant = 'success' | 'warning' | 'error'

export type LabelProps = HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode
  variant?: LabelVariant
}
