import { ReactNode, RefObject } from 'react'

export type PortalProps = {
  containerRef?: RefObject<HTMLElement>
  children: ReactNode
}
