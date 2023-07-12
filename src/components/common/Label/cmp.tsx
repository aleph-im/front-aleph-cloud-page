import React from 'react'
import { StyledLabel } from './styles'
import { LabelProps } from './types'

export const Label = ({ children, ...rest }: LabelProps) => {
  return <StyledLabel {...rest}>{children}</StyledLabel>
}

export default Label
