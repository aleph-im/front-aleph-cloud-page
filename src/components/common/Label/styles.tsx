import { addClasses } from '@aleph-front/core'
import styled, { css } from 'styled-components'
import { LabelVariant } from './types'

export type StyledLabelProps = {
  $variant?: LabelVariant
}

export const StyledLabel = styled.span.attrs<StyledLabelProps>((props) => {
  const { $variant } = props

  const cls =
    $variant === 'success'
      ? 'gr-main1'
      : $variant === 'error'
      ? 'gr-extra1'
      : 'gr-main2'

  return addClasses(`tp-info ${cls}`)(props)
})<StyledLabelProps>`
  ${({ theme }) => {
    return css`
      display: inline-flex;
      padding: 0.25rem 0.94rem;
      color: ${theme.color.base2};
      border-radius: 0.375rem;
      line-height: normal !important;
    `
  }}
`
