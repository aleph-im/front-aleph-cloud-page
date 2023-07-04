import React from 'react'
import { StyledH2, StyledLabel } from './styles'
import { H2Props } from './types'

export const H2 = React.memo(({ children, label, ...rest }: H2Props) => {
  return (
    <StyledH2 {...rest}>
      {children}
      {label && <StyledLabel {...rest}>{label}</StyledLabel>}
    </StyledH2>
  )
})
H2.displayName = 'H2'

export default H2
