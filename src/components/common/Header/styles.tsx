import {
  BreakpointId,
  Button,
  FloatPosition,
  Icon,
  IconName,
  IconProps,
  RouterNavbar,
  WalletPicker,
  getResponsiveCss,
} from '@aleph-front/core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledButton = styled(Button).attrs((props) => {
  return {
    ...props,
    kind: 'rounded',
    variant: 'primary',
    size: 'md',
  }
})`
  display: block;

  &:last-child {
    margin-bottom: 0;
  }
`

export const StyledWalletPicker = styled(WalletPicker)<{
  $position: FloatPosition
  $isOpen: boolean
}>`
  ${({ $position: { x, y }, $isOpen }) => {
    return css`
      ${tw`fixed top-0 left-0 z-20 mt-4`}
      transform: ${`translate3d(${x}px, ${y}px, 0)`};
      opacity: ${$isOpen ? 1 : 0};
      will-change: opacity transform;
      transition: opacity ease-in-out 250ms 0s;
    `
  }}
`

// --------------------------------------------

export type StyledNavbarDesktopProps = {
  $breakpoint?: BreakpointId
}

export const StyledNavbarDesktop = styled.div<StyledNavbarDesktopProps>`
  ${({ $breakpoint }) => css`
    ${tw`relative top-0 z-10 items-center justify-between flex-initial hidden w-full px-16 m-0 shrink-0`}
    height: 6.5rem;
    box-shadow: 0px 4px 24px 0px #5100cd0a;
    backdrop-filter: blur(50px);

    /* MOBILE LAYOUT */
    ${getResponsiveCss(
      $breakpoint,
      css`
        ${tw`flex`}
      `,
    )}
  `}
`

// --------------------------------------------

export type StyledNavbarMobileProps = {
  $breakpoint?: BreakpointId
}

export const StyledNavbarMobile = styled(RouterNavbar)<StyledNavbarMobileProps>`
  ${({ breakpoint }) => css`
    ${tw`relative z-10 block`}

    /* MOBILE LAYOUT */
    ${getResponsiveCss(
      breakpoint,
      css`
        ${tw`hidden`}
      `,
    )}
  `}
`

// --------------------------------------------

export type StyledHeaderProps = {
  $breakpoint?: BreakpointId
}

export const StyledHeader = styled.header<StyledHeaderProps>`
  ${({ $breakpoint }) => css`
    ${tw`fixed top-0 left-0 z-10 w-full m-0`}
    font-size: inherit;
    line-height: inherit;
    box-sizing: border-box;
    /* background-color: #141327CC; */

    /* MOBILE LAYOUT */
    ${getResponsiveCss(
      $breakpoint,
      css`
        ${tw`sticky`}
      `,
    )};
  `}
`

export type StyledIconProps = {
  $isConnected: boolean
  $network?: { icon: IconName }
  $isMobile?: boolean
}

export const StyledIcon = styled(Icon).attrs<StyledIconProps, IconProps>(
  (props) => {
    return {
      ...props,
      size: props.$isMobile ? 'lg' : 'md',
      name: props.$network?.icon || 'link',
    }
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
)<StyledIconProps>`
  ${({ theme, $isConnected, $isMobile }) => css`
    height: 1em !important;
    width: 1em !important;

    ${!$isMobile &&
    css`
      padding: 0.35rem;
      border-radius: 50%;
      background-color: ${theme.color.background};
      border: 1px solid black;
    `}
  `}
`
