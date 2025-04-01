import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledRelatedEntityCard = styled.button`
  ${tw`p-2 flex items-center gap-4 w-fit relative pr-8`}

  ${({ theme }) => css`
    background-color: ${theme.color.base1};

    transition-property: all;
    transition-duration: ${theme.transition.duration.fast}ms;
    transition-timing-function: ${theme.transition.timing};

    .openEntityIcon {
      color: ${theme.color.purple2};
      transition-property: all;
      transition-duration: ${theme.transition.duration.fast}ms;
      transition-timing-function: ${theme.transition.timing};
    }

    &:hover {
      background-color: ${theme.color.purple4}30;

      .openEntityIcon {
        color: ${theme.color.main0};
      }
    }
  `}
`
