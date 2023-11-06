import { HTMLAttributes } from 'react'

export type StatusLabelVariant = 'success' | 'warning' | 'error'

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: StatusLabelVariant
}
