import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export type StyledContainerProps = {
  a?: boolean
}

export const StyledContainer = styled.div<StyledContainerProps>`
  ${({ theme }) => {
    const { background } = theme.component.footer
    const { timing, duration } = theme.transition

    return css`
      ${tw`py-4 px-6 lg:px-16`}

      background: ${background};
      transition: opacity ${timing} ${duration.fast}ms 0s;
    `
  }}
`
