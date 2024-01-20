import {
  BreakpointId,
  Button,
  FloatPosition,
  RouterNavbar,
  WalletPicker,
  getResponsiveCss,
} from '@aleph-front/core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledButton = styled(Button).attrs((props) => {
  return {
    ...props,
    color: 'main0',
    kind: 'default',
    size: 'regular',
    variant: 'tertiary',
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
      ${tw`fixed z-20 mt-4 top-0 left-0`}
      transform: ${`translate3d(${x}px, ${y}px, 0)`};
      opacity: ${$isOpen ? 1 : 0};
      will-change: opacity transform;
      transition: opacity ease-in-out 0.25s 0s;
    `
  }}
`

// --------------------------------------------

export type StyledNavbarDesktopProps = {
  $breakpoint?: BreakpointId
}

export const StyledNavbarDesktop = styled.div<StyledNavbarDesktopProps>`
  ${({ $breakpoint }) => css`
    ${tw`hidden relative flex-initial shrink-0 m-0 px-16 w-full top-0 z-10 items-center justify-between`}
    height: 6.5rem;
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
    ${tw`relative block z-10`}

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
    ${tw`fixed top-0 left-0 m-0 z-10 w-full`}
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
