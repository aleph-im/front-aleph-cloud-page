import React, { memo } from 'react'
import { StyledSkeleton } from './styles'
import { SkeletonProps } from './types'

export const Skeleton = ({ width, height = '1.1em' }: SkeletonProps) => {
  return <StyledSkeleton $width={width} $height={height} />
}
Skeleton.displayName = 'Skeleton'

export default memo(Skeleton) as typeof Skeleton
