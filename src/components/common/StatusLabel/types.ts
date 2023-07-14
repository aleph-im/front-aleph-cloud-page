import { HTMLAttributes } from 'react'

export type StatusLabelVariant =
  | 'ready'
  | 'running'
  | 'confirming'
  | 'unresponsive'

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: StatusLabelVariant
}
