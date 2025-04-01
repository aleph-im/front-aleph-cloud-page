import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { StyledSkeletonProps } from './types'

export const StyledSkeleton = styled.div<StyledSkeletonProps>`
  ${tw`animate-pulse rounded-md`}

  ${({ theme, $width, $height }) => css`
    background: ${theme.color.purple3};
    width: ${$width};
    height: ${$height};
  `}
`
