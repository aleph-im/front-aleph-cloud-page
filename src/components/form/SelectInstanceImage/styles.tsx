import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { getResponsiveCss } from '@aleph-front/aleph-core'

export const StyledFlatCardContainer = styled.div`
  ${tw`flex items-center justify-start md:justify-center flex-nowrap md:flex-wrap gap-6`}
`

export const StyledFlatCard = styled.div<{
  $selected: boolean
  $disabled?: boolean
}>`
  ${({ $selected, $disabled }) => css`
    ${tw`relative flex flex-col items-center justify-center shrink-0 cursor-pointer transition-all duration-300`}
    height: 10.125rem;
    width: 13.875rem;
    background-color: #ffffff1a;
    border-radius: 1.5rem;
    ${$disabled && 'opacity: 0.3;'}

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border-radius: 1.5rem;
      z-index: -1;
      padding: 1px;

      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: exclude;
      mask-composite: exclude;
      -webkit-mask-composite: xor;

      ${$selected &&
      `background-image: linear-gradient(90deg, #00d1ff 0%, #0054ff 100%);`}
    }

    &:hover {
      &::after {
        background-image: linear-gradient(90deg, #00d1ff 0%, #0054ff 100%);
      }
    }

    ${getResponsiveCss(
      'md',
      css`
        width: 30%;
      `,
    )}
  `}
`
