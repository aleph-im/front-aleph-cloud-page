import tw from 'twin.macro'
import styled, { css } from 'styled-components'

export type StyledLabelProps = { $selected?: boolean; $disabled?: boolean }

export const StyledLabel = styled.label<StyledLabelProps>`
  ${({ $selected = false, $disabled = false }) => css`
    ${$disabled ? tw`cursor-not-allowed` : !$selected ? tw`cursor-pointer` : ''}
    ${$disabled &&
    css`
      ${tw`opacity-40 cursor-not-allowed`}
    `}
  `}
`
