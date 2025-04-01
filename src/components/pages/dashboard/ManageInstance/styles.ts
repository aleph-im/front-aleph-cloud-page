import styled, { css } from 'styled-components'
import tw from 'twin.macro'

type StyledSliderContentProps = {
  showLogs: boolean
}

export const StyledSliderContent = styled.div<StyledSliderContentProps>`
  ${tw`flex transition-transform duration-1000 w-[200%]`}

  ${({ showLogs }) =>
    showLogs
      ? css`
          ${tw`-translate-x-1/2`}
        `
      : css`
          ${tw`translate-x-0`}
        `}
`

export const StyledEntityCard = styled.button`
  ${tw`p-2 flex items-center gap-4 w-fit relative pr-8`}

  ${({ theme }) => css`
    background-color: ${theme.color.base1};

    .openEntityIcon {
      color: ${theme.color.purple2};
    }

    transition-property: all;
    transition-duration: ${theme.transition.duration.fast}ms;
    transition-timing-function: ${theme.transition.timing};

    &:hover {
      background-color: ${theme.color.purple4}30;

      .openEntityIcon {
        color: ${theme.color.main0};
      }
    }
  `}
`
