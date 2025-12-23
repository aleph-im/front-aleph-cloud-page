import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export type StyledContainerProps = {
  $sticked?: boolean
  $visible?: boolean
}

export const StyledContainer = styled.div<StyledContainerProps>`
  ${({ theme, $sticked, $visible }) => {
    const { shadow } = theme.component.walletPicker
    const { timing, duration } = theme.transition

    return css`
      ${tw`py-4 px-6 lg:px-16`}

      background: ${theme.color.base1};
      box-shadow: ${$sticked ? shadow : 'none'};
      transform: translateY(${$visible ? '0' : '100%'});
      transition:
        box-shadow ${timing} ${duration.fast}ms 0s,
        transform ${timing} ${duration.normal}ms 0s;
    `
  }}
`
