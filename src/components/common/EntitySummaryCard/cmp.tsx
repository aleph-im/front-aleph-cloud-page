import React, { memo } from 'react'
import { ObjectImg } from '@aleph-front/core'
import { EntitySummaryCardProps } from './types'
import { useTheme } from 'styled-components'
import { StyledEntitySummaryCard } from './styles'
import { ComputingEntityDataPill } from '../ComputingEntityDataPill/cmp'

export const EntitySummaryCard = ({
  title,
  img,
  running,
}: EntitySummaryCardProps) => {
  return (
    <StyledEntitySummaryCard>
      <div tw="flex justify-center items-center gap-3">
        <ObjectImg shape color="main0" size={36} id={img as any} />
        <p className="tp-h7 text-base2 fs-16">{title}</p>
      </div>
      <ComputingEntityDataPill value={running} icon="play" />
    </StyledEntitySummaryCard>
  )
}
EntitySummaryCard.displayName = 'EntitySummaryCard'

export default memo(EntitySummaryCard) as typeof EntitySummaryCard
