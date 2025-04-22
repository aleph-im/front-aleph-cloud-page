import { css } from 'styled-components'
import tw, { styled } from 'twin.macro'

export type StyledProgressContainerProps = {
  $show: boolean
}

export const StyledProgressContainer = styled.div<StyledProgressContainerProps>`
  ${({ $show }) => css`
    ${tw`fixed lg:absolute top-0 left-0 right-0 z-50`}
    height: 0.1875rem;

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
