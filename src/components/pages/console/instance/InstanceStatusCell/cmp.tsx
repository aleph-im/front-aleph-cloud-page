import React, { memo, useMemo } from 'react'
import { Icon, Label } from '@aleph-front/core'
import { InstanceStatusCellProps } from './types'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import { StyledStatusIcon, StatusIconVariant } from './styles'

export const InstanceStatusCell = ({
  calculatedStatus,
  variant = 'badge',
}: InstanceStatusCellProps) => {
  const theme = useTheme()

  const statusVariant: StatusIconVariant = useMemo(() => {
    switch (calculatedStatus) {
      case 'loading':
      case 'starting':
      case 'rebooting':
        return 'loading'
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
      case 'starting':
        return 'Starting'
      case 'rebooting':
        return 'Rebooting'
      default:
        return 'Unknown'
    }
  }, [calculatedStatus])

  const showSpinner = useMemo(() => {
    switch (calculatedStatus) {
      case 'loading':
      case 'stopping':
      case 'preparing':
      case 'starting':
      case 'rebooting':
        return true
      default:
        return false
    }
  }, [calculatedStatus])

  const spinnerColor = useMemo(() => {
    const colorMap: Record<StatusIconVariant, string> = {
      success: theme.color.success,
      warning: theme.color.warning,
      error: theme.color.error,
      loading: theme.color.main0,
    }
    return colorMap[statusVariant]
  }, [statusVariant, theme])

  // Label component doesn't support 'loading' variant, map it to 'warning'
  const labelVariant = statusVariant === 'loading' ? 'info' : statusVariant

  if (variant === 'icon') {
    return (
      <StyledStatusIcon $variant={statusVariant} title={text}>
        {showSpinner ? (
          <RotatingLines strokeColor={spinnerColor} width="1rem" />
        ) : (
          <Icon name="alien-8bit" size="1.2rem" />
        )}
      </StyledStatusIcon>
    )
  }

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
