import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledFlatCardContainer = styled.div`
  ${tw`flex items-center justify-start md:justify-evenly flex-nowrap md:flex-wrap gap-6`}
`

export type StyledFlatCardProps = {
  $selected?: boolean
  $disabled?: boolean
}

export const StyledFlatCard = styled.div<StyledFlatCardProps>`
  ${({ theme, $selected, $disabled }) => {
    return css`
      ${tw`relative flex flex-col items-center justify-center shrink-0 cursor-pointer`}
      ${tw`transition-all duration-300`}
      color: ${theme.color.main0};
      border: 0.1875rem solid transparent;
      border-radius: 1.5rem;
      background: linear-gradient(
        118deg,
        ${theme.color.purple2} 26.64%,
        #f4ecff66 118.38%
      );
      background-origin: border-box;

      ${$selected &&
      css`
        border-color: ${theme.color.main0};
        border-width: 0.1875rem;
      `}

      &:hover {
        border-color: ${theme.color.main0};
        border-width: 0.1875rem;

        /* SHADOWS/purple02 */
        box-shadow: 0px 4px 24px 0px rgba(81, 0, 205, 0.45);
        backdrop-filter: blur(50px);
      }

      ${$disabled &&
      css`
        filter: grayscale(1);
      `}
    `
  }}
`
