import React, { memo, useMemo } from 'react'
import { Icon, Label } from '@aleph-front/core'
import { InstanceStatusCellProps } from './types'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'

export const InstanceStatusCell = ({
  calculatedStatus,
}: InstanceStatusCellProps) => {
  const theme = useTheme()

  const labelVariant = useMemo(() => {
    switch (calculatedStatus) {
      case 'loading':
        return 'warning'
      case 'v1':
        return 'success'
      case 'not-allocated':
        return 'warning'
      case 'stopped':
        return 'error'
      case 'stopping':
        return 'warning'
      case 'running':
        return 'success'
      case 'preparing':
        return 'warning'
      default:
        return 'warning'
    }
  }, [calculatedStatus])

  const text = useMemo(() => {
    switch (calculatedStatus) {
      case 'loading':
        return 'Loading'
      case 'v1':
        return 'Allocated'
      case 'not-allocated':
        return 'Not Allocated'
      case 'stopped':
        return 'Stopped'
      case 'stopping':
        return 'Stopping'
      case 'running':
        return 'Running'
      case 'preparing':
        return 'Preparing'
      default:
        return 'Unknown'
    }
  }, [calculatedStatus])

  const showSpinner = useMemo(() => {
    switch (calculatedStatus) {
      case 'loading':
        return true
      case 'stopping':
        return true
      case 'preparing':
        return true
      default:
        return false
    }
  }, [calculatedStatus])

  return (
    <Label kind="secondary" variant={labelVariant}>
      <div tw="flex items-center justify-center gap-2">
        <Icon name="alien-8bit" className={`text-${labelVariant}`} size="xs" />
        <span tw="whitespace-nowrap">{text}</span>
        {showSpinner && (
          <RotatingLines strokeColor={theme.color.base2} width=".6rem" />
        )}
      </div>
    </Label>
  )
}

InstanceStatusCell.displayName = 'InstanceStatusCell'

export default memo(InstanceStatusCell) as typeof InstanceStatusCell
