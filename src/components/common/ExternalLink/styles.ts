import { CoreTheme, getTypoCss } from '@aleph-front/core'
import styled from 'styled-components'
import { css } from 'styled-components'

export type StyledExternalLinkProps = {
  $color?: keyof CoreTheme['color']
  $typo?: keyof CoreTheme['typo']
  $underline?: boolean
}

export const StyledExternalLink = styled.a<StyledExternalLinkProps>`
  ${({ theme, $color = 'white', $typo, $underline = false }) => css`
    color: ${theme.color[$color]};
    text-decoration: ${$underline ? 'underline' : 'none'};
    ${$typo ? getTypoCss($typo) : ''}
  `}
`
