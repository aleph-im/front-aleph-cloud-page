import styled, { css } from 'styled-components'
import tw from 'twin.macro'

type StyledRelatedEntityCardProps = {
  $disabled?: boolean
}

export const StyledRelatedEntityCard = styled.button<StyledRelatedEntityCardProps>`
  ${tw`p-2 flex items-center gap-4 w-fit relative pr-8`}

  ${({ theme, $disabled }) => css`
    transition-property: all;
    transition-duration: ${theme.transition.duration.fast}ms;
    transition-timing-function: ${theme.transition.timing};

    .openEntityIcon {
      transition-property: all;
      transition-duration: ${theme.transition.duration.fast}ms;
      transition-timing-function: ${theme.transition.timing};
    }
    ${$disabled
      ? css`
          background-color: ${theme.color.base1};
          opacity: 0.5;

          cursor: not-allowed;
        `
      : css`
          background-color: ${theme.color.base1};

          .openEntityIcon {
            color: ${theme.color.purple2};
          }

          &:hover {
            background-color: ${theme.color.purple4}30;

            .openEntityIcon {
              color: ${theme.color.main0};
            }
          }
        `}
  `}
`
