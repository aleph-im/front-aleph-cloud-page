import tw from 'twin.macro'
import styled, { css } from 'styled-components'

export type StyledSpinnerContainerProps = {
  $show: boolean
  $center: boolean
  $fullScreen: boolean
}

export const StyledSpinnerContainer = styled.div<StyledSpinnerContainerProps>`
  ${({ theme, $fullScreen, $show, $center }) => css`
    ${tw`inset-0 flex justify-center py-10 h-full min-h-[11rem]`}
    position: ${$fullScreen ? 'fixed' : 'absolute'};
    backdrop-filter: blur(3px);
    border-radius: inherit;
    opacity: ${$show ? '1' : '0'};
    align-items: ${$center ? 'center' : 'flex-start'};
    padding-top: ${$center ? '2.5rem' : '6rem'};
    z-index: 99;
    transition: all ease-in-out 500ms 500ms;
    background-color: ${theme.color.contentBackground}0C;
  `}
`
