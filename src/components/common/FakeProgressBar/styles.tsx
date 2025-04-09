import { css } from 'styled-components'
import tw, { styled } from 'twin.macro'

export type StyledProgressContainerProps = {
  $show: boolean
}

export const StyledProgressContainer = styled.div<StyledProgressContainerProps>`
  ${({ $show }) => css`
    ${tw`fixed lg:absolute top-0 left-0 right-0 h-1 z-50`}

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
}

export const StyledFakeProgressBar = styled.div<StyledFakeProgressBarProps>`
  ${({ theme, $progress }) => css`
    ${tw`relative h-full`}

    width: ${$progress || 0}%;

    background: ${theme.color.main0}90;
    transition: width 0.3s ease-out;
  `}
`
