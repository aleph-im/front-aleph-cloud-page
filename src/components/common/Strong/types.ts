import { HTMLAttributes, ReactNode } from 'react'

export type StrongProps = HTMLAttributes<HTMLHeadingElement> & {
  color?: string
  children: ReactNode
}
