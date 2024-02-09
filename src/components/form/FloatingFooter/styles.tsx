import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export type StyledContainerProps = {
  $sticked?: boolean
}

export const StyledContainer = styled.div<StyledContainerProps>`
  ${({ theme, $sticked }) => {
    const { shadow } = theme.component.walletPicker
    const { timing, duration } = theme.transition

    return css`
      ${tw`py-4 px-6 lg:px-16`}

      background: ${theme.color.base1};
      box-shadow: ${$sticked ? shadow : 'none'};
      transition: all ${timing} ${duration.fast}ms 0s;
      transition-property: opacity, box-shadow;
    `
  }}
`
