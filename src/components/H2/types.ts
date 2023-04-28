import { HTMLAttributes, ReactNode } from 'react'

export type H2Props = HTMLAttributes<HTMLHeadingElement> & {
  color?: string
  label?: string
  children: ReactNode
}
