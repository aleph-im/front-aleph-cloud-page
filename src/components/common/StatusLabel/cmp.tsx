import React, { useMemo } from 'react'
import { StatusLabelProps } from './types'
import Label from '../Label/cmp'
import { LabelVariant } from '../Label/types'
import { RotatingLines } from 'react-loader-spinner'
import { Icon } from '@aleph-front/aleph-core'
import { useTheme } from 'styled-components'

export const StatusLabel = React.memo(
  ({ variant, ...rest }: StatusLabelProps) => {
    const theme = useTheme()

    const labelVariant: LabelVariant = useMemo(
      () =>
        variant === 'running' || variant === 'ready'
          ? 'success'
          : variant === 'confirming'
          ? 'warning'
          : 'error',
      [variant],
    )

    const labelContent = useMemo(
      () =>
        variant === 'ready' ? (
          <>READY</>
        ) : variant === 'running' ? (
          <>RUNNING</>
        ) : variant === 'confirming' ? (
          <div tw="flex items-center">
            <div tw="mr-2">CONFIRMING</div>
            <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
          </div>
        ) : (
          <div tw="flex items-center">
            <Icon name="warning" tw="mr-2" size="xs" />
            <div>INSTANCE UNRESPONSIVE</div>
          </div>
        ),
      [theme, variant],
    )

    return (
      <Label {...rest} variant={labelVariant}>
        {labelContent}
      </Label>
    )
  },
)
StatusLabel.displayName = 'StatusLabel'

export default StatusLabel
