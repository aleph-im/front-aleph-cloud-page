import { HTMLAttributes } from 'react'

export type LabelProps = HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode
}
