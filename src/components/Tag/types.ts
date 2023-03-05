import { HTMLAttributes } from "react"

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode
}
