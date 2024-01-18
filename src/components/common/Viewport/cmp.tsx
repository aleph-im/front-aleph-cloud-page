import { ViewportProps } from './types'
import { StyledViewport } from './styles'
import { memo } from 'react'

export const Viewport = ({ children }: ViewportProps) => {
  return <StyledViewport>{children}</StyledViewport>
}
Viewport.displayName = 'Viewport'

export default memo(Viewport)
