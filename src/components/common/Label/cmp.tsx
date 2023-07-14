import React from 'react'
import { StyledLabel } from './styles'
import { LabelProps } from './types'

export const Label = React.memo(
  ({ children, variant, ...rest }: LabelProps) => {
    return (
      <StyledLabel {...rest} $variant={variant}>
        {children}
      </StyledLabel>
    )
  },
)
Label.displayName = 'Label'

export default Label
