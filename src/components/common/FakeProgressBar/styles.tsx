import { BreakpointId, getResponsiveCss } from '@aleph-front/core'
import { css } from 'styled-components'
import tw, { styled } from 'twin.macro'

export type StyledProgressContainerProps = {
  $breakpoint: BreakpointId
  $show: boolean
}

export const StyledProgressContainer = styled.div<StyledProgressContainerProps>`
  ${({ $breakpoint, $show }) => css`
    ${tw`fixed lg:absolute left-0 right-0 top-0 bottom-auto z-50`}
    height: 0.1875rem;

    ${getResponsiveCss(
      $breakpoint,
      css`
        ${tw`bottom-0 top-auto`}
      `,
    )}

    ${$show
      ? css`
          display: initial;
        `
      : css`
          display: none;
        `}
  `}
`

export type StyledFakeProgressBarProps = {
  $progress: number
  $skipTransition?: boolean
}

export const StyledFakeProgressBar = styled.div<StyledFakeProgressBarProps>`
  ${({ theme, $progress, $skipTransition }) => css`
    ${tw`relative h-full`}

    width: ${$progress || 0}%;

    background: ${theme.color.main0};
    transition: ${$skipTransition ? 'none' : 'width 0.3s ease-out'};
  `}
`
