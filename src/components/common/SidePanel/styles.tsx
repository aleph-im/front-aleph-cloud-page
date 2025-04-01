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
    background: rgba(0, 0, 0, 0.5);

    transition:
      opacity ${theme.transition.duration.normal}ms ease-in-out,
      visibility ${theme.transition.duration.normal}ms ease-in-out;
    opacity: 0;
    visibility: hidden;
    z-index: 28; /* just below the side panel */

    ${$isOpen &&
    css`
      opacity: 1;
      visibility: visible;
    `}
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
    position: fixed;
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
    z-index: 50;

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
      right: 0.5 rem;
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
