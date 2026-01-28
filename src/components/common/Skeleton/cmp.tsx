import React, { memo } from 'react'
import { StyledSkeleton } from './styles'
import { SkeletonProps } from './types'

export const Skeleton = ({
  width,
  height = '1.1em',
  color = 'purple3',
}: SkeletonProps) => {
  return <StyledSkeleton $width={width} $height={height} $color={color} />
}
Skeleton.displayName = 'Skeleton'

export default memo(Skeleton) as typeof Skeleton
