import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import {
  getGlowHoverEffectCss,
  getResponsiveCss,
} from '@aleph-front/aleph-core'

export const StyledFlatCardContainer = styled.div`
  ${tw`flex items-center justify-start md:justify-center flex-nowrap md:flex-wrap gap-6`}
`

export const StyledFlatCard = styled.div<{
  $selected: boolean
  $disabled?: boolean
}>`
  ${({ $selected, $disabled }) => css`
    ${tw`flex flex-col items-center justify-center shrink-0 cursor-pointer transition-all duration-300`}
    height: 10.125rem;
    width: 13.875rem;
    background-color: #ffffff1a;
    border-radius: 1.5rem;
    ${$selected && `border: 1px solid white;`}
    ${$disabled && 'opacity: 0.3;'}

    &:hover {
      ${!$disabled && getGlowHoverEffectCss('main0')}
    }

    ${getResponsiveCss(
      'md',
      css`
        width: 30%;
      `,
    )}
  `}
`
