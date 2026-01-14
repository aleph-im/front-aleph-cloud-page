import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { StyledSkeletonProps } from './types'

export const StyledSkeleton = styled.div<StyledSkeletonProps>`
  ${tw`animate-pulse rounded-md`}

  ${({ theme, $width, $height, $color }) => css`
    background-color: ${theme.color[$color] || $color};
    width: ${$width};
    height: ${$height};
  `}
`
