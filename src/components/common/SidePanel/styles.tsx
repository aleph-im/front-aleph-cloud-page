import styled, { css } from 'styled-components'
import { StyledSidePanelProps } from './types'
import tw from 'twin.macro'

export const StyledBackdrop = styled.div<StyledSidePanelProps>`
  ${({ theme, $isOpen }) => css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 20;

    background-color: ${$isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'};
    visibility: ${$isOpen ? 'inherit' : 'hidden'};
    transition-property: background-color, visibility;
    transition-duration: ${theme.transition.duration.normal}ms;
    transition-timing-function: ${theme.transition.timing};
  `}
`

export const StyledHeader = styled.div`
  ${({ theme }) => css`
    ${tw`sticky top-0 pt-10 pb-4`}

    background: ${theme.color.background};
  `}
`

export const StyledSidePanel = styled.div<StyledSidePanelProps>`
  ${({ theme, $isOpen }) => css`
    position: absolute;
    background-color: ${theme.color.background};
    overflow-y: auto;

    /* Desktop Styles */
    top: 1rem;
    right: 1rem;
    bottom: 1rem;
    width: 50vw;

    /* For sliding effect on desktop */
    transform: translateX(100%);
    transition: transform ${theme.transition.duration.normal}ms ease-in-out;

    ${$isOpen
      ? css`
          transform: translateX(0);
        `
      : css`
          transform: translateX(100%);
        `}

    /* Mobile Styles */
    @media (max-width: 768px) {
      top: auto;
      bottom: 0;
      left: 0.5rem;
      right: 0.5rem;
      height: 80vh;
      width: initial;
      border-radius: 1.5rem 1.5rem 0 0;

      /* Override the transform for vertical sliding */
      transform: translateY(100%);
      transition: transform ${theme.transition.duration.normal}ms ease-in-out;

      ${$isOpen
        ? css`
            transform: translateY(0);
          `
        : css`
            transform: translateY(100%);
          `}
    }
  `}
`
