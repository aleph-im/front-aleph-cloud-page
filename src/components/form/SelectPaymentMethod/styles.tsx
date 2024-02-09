import tw from 'twin.macro'
import styled, { css } from 'styled-components'

export type StyledLabelProps = { $disabled?: boolean }

export const StyledLabel = styled.label<StyledLabelProps>`
  ${({ $disabled = false }) => css`
    /* ${tw`cursor-pointer`} */
    /* @todo: fix it after supporting stream payment with automatic allocation or hold payment with manual allocation */
    ${tw`cursor-not-allowed`}

    ${$disabled &&
    css`
      ${tw`opacity-40 cursor-not-allowed`}
    `}
  `}
`
