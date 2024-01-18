import { ContentProps } from './types'
import { StyledContent } from './styles'
import { memo } from 'react'

export const Content = ({ children }: ContentProps) => {
  return <StyledContent>{children}</StyledContent>
}
Content.displayName = 'Content'

export default memo(Content)
