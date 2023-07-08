import { HTMLAttributes, ReactNode } from 'react'

export type H1Props = HTMLAttributes<HTMLHeadingElement> & {
  color?: string
  children: ReactNode
}
