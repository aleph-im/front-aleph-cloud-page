import { BreakpointId, RouterNavbar, getResponsiveCss } from '@aleph-front/core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

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
