import React, { memo } from 'react'
import { ComputingEntityDataPillProps } from './types'
import { StyledComputingEntityDataPill } from './styles'
import { Icon } from '@aleph-front/core'
import { useTheme } from 'styled-components'

export const ComputingEntityDataPill = ({
  value = 0,
  icon,
}: ComputingEntityDataPillProps) => {
  const theme = useTheme()

  return (
    <StyledComputingEntityDataPill>
      <p
        className="fs-12 tp-h7 text-base2"
        tw="flex text-center items-center justify-center gap-1"
      >
        {value}
        {icon && <Icon size="0.7em" name={icon} color={theme.color.base2} />}
      </p>
    </StyledComputingEntityDataPill>
  )
}

ComputingEntityDataPill.displayName = 'ComputingEntityDataPill'

export default memo(ComputingEntityDataPill) as typeof ComputingEntityDataPill
