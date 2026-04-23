import {
  FloatPosition,
  addClasses,
  Icon,
  IconName,
  IconProps,
} from '@aleph-front/core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

type StyledPickerProps = {
  $position: FloatPosition
  $isOpen: boolean
}

export const StyledPicker = styled.div<StyledPickerProps>`
  ${({ theme, $position: { x, y }, $isOpen }) => {
    const { background, shadow } = theme.component.walletPicker

    return css`
      ${tw`fixed top-0 left-0 z-10 mt-4`}
      min-width: 20rem;
      border-radius: 1.875rem;
      background: ${background};
      padding: 1.5rem;
      box-shadow: ${shadow};
      backdrop-filter: blur(50px);
      transform: ${`translate3d(${x}px, ${y}px, 0)`};
      opacity: ${$isOpen ? 1 : 0};
      will-change: opacity transform;
      transition: opacity ease-in-out 250ms 0s;
    `
  }}
`

export type StyledIconProps = {
  $isConnected: boolean
  $network?: { icon: IconName }
  $isMobile?: boolean
  $withBackground?: boolean
}

export const StyledIcon = styled(Icon).attrs<StyledIconProps, IconProps>(
  (props) => {
    return {
      ...props,
      size: props.$isMobile ? 'lg' : 'md',
      name: props.$network?.icon || 'link',
    }
  },
)<StyledIconProps>`
  ${({ theme, $isMobile, $withBackground = true }) => css`
    height: 1em !important;
    width: 1em !important;

    ${!$isMobile &&
    css`
      padding: 0.35rem;
      border-radius: 50%;
      ${$withBackground &&
      css`
        background-color: ${theme.color.background};
        border: 1px solid black;
      `}
    `}
  `}
`

export const StyledLine = styled.div`
  ${({ theme }) => {
    const { border } = theme.component.walletPicker

    return css`
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: ${border.size}rem solid ${border.color};
    `
  }}
`

export const StyledTitle = styled.h6.attrs(addClasses('tp-nav'))`
  ${({ theme }) => {
    const { color } = theme.component.walletPicker

    return css`
      color: ${color.default};
      font-size: 1.125rem;
      margin: 0 0 2rem 0;
    `
  }}
`
