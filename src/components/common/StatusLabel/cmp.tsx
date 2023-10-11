import React, { useMemo } from 'react'
import { StatusLabelProps } from './types'
import Label from '../Label/cmp'
import { useTheme } from 'styled-components'

export const StatusLabel = React.memo(
  ({ variant, children, ...rest }: StatusLabelProps) => {
    const theme = useTheme()

    return (
      <Label {...rest} variant={variant}>
        { children }
      </Label>
    )
  },
)
StatusLabel.displayName = 'StatusLabel'

export default StatusLabel
