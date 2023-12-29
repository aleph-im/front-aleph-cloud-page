import tw from 'twin.macro'
import styled, { css } from 'styled-components'

export type StyledLabelProps = { $disabled?: boolean }

export const StyledLabel = styled.label<StyledLabelProps>`
  ${({ $disabled = false }) => css`
    ${tw`cursor-pointer`}

    ${$disabled &&
    css`
      ${tw`opacity-40 cursor-not-allowed`}
    `}
  `}
`
