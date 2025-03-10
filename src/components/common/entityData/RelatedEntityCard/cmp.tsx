import React, { memo } from 'react'
import { RelatedEntityCardProps } from './types'
import { StyledRelatedEntityCard } from './styles'
import { Icon } from '@aleph-front/core'

export const RelatedEntityCard = ({
  children,
  onClick: handleClick,
}: RelatedEntityCardProps) => {
  return (
    <StyledRelatedEntityCard onClick={handleClick}>
      {children}
      <Icon name="eye" tw="absolute top-2 right-2" className="openEntityIcon" />
    </StyledRelatedEntityCard>
  )
}
RelatedEntityCard.displayName = 'RelatedEntityCard'

export default memo(RelatedEntityCard) as typeof RelatedEntityCard
