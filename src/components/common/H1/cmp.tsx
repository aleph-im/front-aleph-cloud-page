import React, { memo } from 'react'
import { StyledH1 } from './styles'
import { H1Props } from './types'

export const H1 = ({ children, ...rest }: H1Props) => {
  return <StyledH1 {...rest}>{children}</StyledH1>
}
H1.displayName = 'H1'

export default memo(H1) as typeof H1
