import React, { memo } from 'react'
import { Icon, Label } from '@aleph-front/core'
import { useTheme } from 'styled-components'
import { RotatingLines } from 'react-loader-spinner'
import { EntityStatusBadgeProps } from './types'

export const EntityStatusBadge = ({
  icon,
  text,
  variant,
  showSpinner = false,
}: EntityStatusBadgeProps) => {
  const theme = useTheme()

  return (
    <Label kind="secondary" variant={variant}>
      <div tw="flex items-center justify-center gap-2">
        {icon && <Icon name={icon} className={`text-${variant}`} />}
        <span tw="whitespace-nowrap">{text}</span>
        {showSpinner && (
          <RotatingLines strokeColor={theme.color.base2} width=".8rem" />
        )}
      </div>
    </Label>
  )
}
EntityStatusBadge.displayName = 'EntityStatusBadge'

export default memo(EntityStatusBadge) as typeof EntityStatusBadge
