import tw from 'twin.macro'
import styled from 'styled-components'

export type StyledSpinnerContainerProps = {
  $show: boolean
  $center: boolean
  $fullScreen: boolean
}

export const StyledSpinnerContainer = styled.div<StyledSpinnerContainerProps>`
  ${tw`inset-0 flex justify-center py-10 h-full min-h-[11rem]`}
  /* background-color: #00000020; */
  /* box-shadow: 0px 0px 20px 10px #00000020; */
  position: ${({ $fullScreen }) => ($fullScreen ? 'fixed' : 'absolute')};
  backdrop-filter: blur(3px);
  border-radius: inherit;
  opacity: ${({ $show }) => ($show ? '1' : '0')};
  align-items: ${({ $center }) => ($center ? 'center' : 'flex-start')};
  z-index: 99;
  transition: all ease-in-out 0.5s 0.5s;
`
