import styled, { css } from 'styled-components'
import { StyledSidePanelProps } from './types'
import tw from 'twin.macro'

export const StyledBackdrop = styled.div<StyledSidePanelProps>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
  z-index: 28; /* just below the side panel */

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      display: block;
      opacity: 1;
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
    top: 0;
    right: 0;
    height: 100vh;
    width: 50vw;

    /* For sliding effect on desktop */
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
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
      left: 0;
      width: 100vw;
      height: 80vh;
      border-radius: 1.5rem 1.5rem 0 0;

      /* Override the transform for vertical sliding */
      transform: translateY(100%);
      transition: transform 0.3s ease-in-out;

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
