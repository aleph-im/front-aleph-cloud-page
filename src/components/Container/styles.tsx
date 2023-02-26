import { getResponsiveCss } from '@aleph-front/aleph-core'
import styled, {
  css,
} from 'styled-components'

export const StyledContainer = styled.div`
  ${({ theme }) => {
    const responsiveWidth = Object.entries(theme.breakpoint).sort(([, av], [, bv]) => av - bv)
    const responsiveCss = responsiveWidth.map(([k, v]) => getResponsiveCss(k as any, css`
      max-width: ${v}rem;
    `))

    return css`
      width: 100%;
      margin: 0 auto;
      ${responsiveCss}
    `
  }}
`
