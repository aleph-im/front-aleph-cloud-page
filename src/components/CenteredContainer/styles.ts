import { getResponsiveCss } from '@aleph-front/aleph-core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

const StyledCenteredContainer = styled.div`
  ${({ theme }) => css`
    ${tw`px-6`}
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto;
    max-width: ${theme.breakpoint.xxl + 12.5}rem;

    ${getResponsiveCss(
      'xl',
      css`
        ${tw`px-0`}
        /* width: 50%; */
        width: 715px;
      `,
    )}
  `}
`

export default StyledCenteredContainer
