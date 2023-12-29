import React, { memo } from 'react'
import { StatusLabelProps } from './types'
import Label from '../Label'

export const StatusLabel = ({
  variant,
  children,
  ...rest
}: StatusLabelProps) => {
  return (
    <Label {...rest} variant={variant}>
      {children}
    </Label>
  )
}
StatusLabel.displayName = 'StatusLabel'

export default memo(StatusLabel) as typeof StatusLabel
