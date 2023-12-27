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
    const [g0, g1] = theme.gradient.main0.colors

    return css`
      ${tw`relative flex flex-col items-center justify-center shrink-0 cursor-pointer`}
      background-color: #ffffff1a;
      border-radius: 1.5rem;
      ${$disabled && 'opacity: 0.3;'}

      &::after {
        ${tw`transition-all duration-300`}
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border-radius: 1.5rem;
        z-index: -1;
        padding: 1px;
        opacity: 0;

        background-image: linear-gradient(90deg, ${g0} 0%, ${g1} 100%);

        -webkit-mask: linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: exclude;
        mask-composite: exclude;
        -webkit-mask-composite: xor;

        ${$selected &&
        css`
          opacity: 1;
        `}
      }

      &:hover::after {
        opacity: 1;
      }
    `
  }}
`
