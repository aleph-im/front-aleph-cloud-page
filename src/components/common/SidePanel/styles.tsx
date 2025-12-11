import styled, { css } from 'styled-components'
import { StyledSidePanelProps } from './types'
import tw from 'twin.macro'

export const StyledBackdrop = styled.div<StyledSidePanelProps>`
  ${({ theme, $isOpen, $order = 0 }) => css`
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
    z-index: ${28 + $order}; /* just below the side panel */

    ${$isOpen &&
    css`
      opacity: 1;
      visibility: visible;
    `}
  `}
`

export const StyledHeader = styled.div`
  ${({ theme }) => css`
    ${tw`top-0 pt-10 pb-4`}

    background: ${theme.color.background};
  `}
`

export const StyledContent = styled.div`
  ${tw`p-12 pb-0 flex-1`}
`

export const StyledSidePanel = styled.div<StyledSidePanelProps>`
  ${({
    theme,
    $isOpen,
    $order = 0,
    $width = '50vw',
    $mobileHeight = '80vh',
  }) => css`
    position: fixed;
    background-color: ${theme.color.background};
    overflow: hidden;
    display: flex;
    flex-direction: column;

    /* Desktop Styles */
    top: 1rem;
    right: 1rem;
    bottom: 1rem;
    width: ${$width};

    /* For sliding effect on desktop */
    transform: translateX(100%);
    transition: transform ${theme.transition.duration.normal}ms ease-in-out;
    z-index: ${29 + $order * 2}; /* above the backdrop */

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
      height: ${$mobileHeight};
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
