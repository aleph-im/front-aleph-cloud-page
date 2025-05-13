import React, { memo, useCallback } from 'react'
import { Icon } from '@aleph-front/core'
import { RelatedEntityCardProps } from './types'
import { StyledRelatedEntityCard } from './styles'

export const RelatedEntityCard = ({
  children,
  disabled = false,
  onClick: handleClick,
}: RelatedEntityCardProps) => {
  const handleRelatedEntityClick = useCallback(() => {
    if (disabled) return

    handleClick()
  }, [disabled, handleClick])

  return (
    <StyledRelatedEntityCard
      onClick={handleRelatedEntityClick}
      $disabled={disabled}
    >
      {children}
      <Icon name="eye" tw="absolute top-2 right-2" className="openEntityIcon" />
    </StyledRelatedEntityCard>
  )
}
RelatedEntityCard.displayName = 'RelatedEntityCard'

export default memo(RelatedEntityCard) as typeof RelatedEntityCard
