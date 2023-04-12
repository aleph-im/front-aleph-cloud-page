import { HTMLAttributes } from "react"

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
}
