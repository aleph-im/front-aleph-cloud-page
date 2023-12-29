import React, { memo } from 'react'
import { StyledLabel } from './styles'
import { LabelProps } from './types'

export const Label = ({ children, variant, ...rest }: LabelProps) => {
  return (
    <StyledLabel {...rest} $variant={variant}>
      {children}
    </StyledLabel>
  )
}
Label.displayName = 'Label'

export default memo(Label) as typeof Label
