import styled, { keyframes } from 'styled-components'
import tw from 'twin.macro'
import { Icon } from '@aleph-front/core'

const transfer1 = keyframes` 
  0%  {
    opacity: 0;
    transform: translate3d(-100%,0,0);
  }
 
  50% {
    opacity: 1;
    transform: translate3d(0,0,0);
  }

  100% {
    opacity: 0;
    transform: translate3d(100%,0,0);
  }
`

export const StyledArrowIcon = styled(Icon).attrs((props) => {
  return {
    ...props,
    name: 'angle-double-right',
    size: '1.5rem',
    color: 'main0',
  }
})`
  ${tw`p-1 origin-center`}
  animation: 1000ms linear 0ms infinite ${transfer1};
`
