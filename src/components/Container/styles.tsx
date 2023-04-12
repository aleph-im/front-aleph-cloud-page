import { addClasses } from '@aleph-front/aleph-core'
import styled, { css } from 'styled-components'

export const StyledContainer = styled.div.attrs(addClasses('px-lg px-xl3-md'))`
  ${({ theme }) => {
    return css`
      box-sizing: border-box;
      width: 100%;
      margin: 0 auto;
      max-width: ${theme.breakpoint.xxl + 12.5}rem;
    `
  }}
`
