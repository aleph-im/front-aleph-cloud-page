import styled, { css } from 'styled-components'
import { StyledSidePanelProps, StyledFooterProps } from './types'
import tw from 'twin.macro'

export const StyledBackdrop = styled.div<StyledSidePanelProps>`
  ${({ theme, $isOpen, $order = 0 }) => css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: ${20 + $order};

    background-color: ${$isOpen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'};
    visibility: ${$isOpen ? 'inherit' : 'hidden'};
    transition-property: background-color, visibility;
    transition-duration: ${theme.transition.duration.normal}ms;
    transition-timing-function: ${theme.transition.timing};
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
  overflow-y: auto;
`

export const StyledFooter = styled.div<StyledFooterProps>`
  ${({ theme, $isOpen }) => css`
    ${tw`fixed bottom-0 left-0 right-0 p-6`}

    background: ${theme.color.background}99;
    max-height: 5.375rem;

    ${$isOpen &&
    css`
      animation: slideUp ${theme.transition.duration.normal}ms
        ${theme.transition.timing} forwards;
    `}

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `}
`

export const StyledSidePanel = styled.div<StyledSidePanelProps>`
  ${({
    theme,
    $isOpen,
    $order = 0,
    $width = '43rem',
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
    width: calc(${$width} - ${$order * 20}px);

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
      right: 0.5 rem;
      height: calc(${$mobileHeight} - ${$order * 20}px);
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
