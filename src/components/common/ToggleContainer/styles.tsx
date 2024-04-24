import { Icon } from '@aleph-front/core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledToggleContainer = styled.div<{ $height?: string }>`
  ${tw`transition-all duration-700 overflow-hidden`}
  height: ${({ $height }) => $height};
`

export type StyledIconProps = {
  $isOpen: boolean
  $isVisible: boolean
}

export const StyledIcon = styled(Icon).attrs((props) => {
  return { ...props, name: 'angle-down', size: 'lg' }
})<StyledIconProps>`
  ${({ theme, $isOpen, $isVisible }) => css`
    ${tw`p-1 cursor-pointer`}
    width: 1em;
    background-color: ${theme.color.text};
    color: ${theme.color.purple2};
    transform: rotate(${$isOpen ? 180 : 0}deg);
    opacity: ${$isVisible ? 1 : 0};
    visibility: ${$isVisible ? 'inherit' : 'hidden'};

    transition-property: opacity, visibility, transform;
    transition-duration: ${theme.transition.duration.normal}ms;
    transition-timing-function: ${theme.transition.timing};
  `}
`
