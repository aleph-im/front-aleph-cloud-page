import { NoisyContainer } from '@aleph-front/core'
import styled, { css, keyframes } from 'styled-components'

// Keyframes

const fadeInShadowAnimation = keyframes`
  0% {
    box-shadow: 0px 0 0 rgba(81, 0, 205, 0);
  }
  100% {
    box-shadow: 6px 0 8px rgba(81, 0, 205, 0.15);
  }
`

const increaseWidth = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 17rem;
  }
`

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  33% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

// Common styles
const showSubItemsStyles = css`
  z-index: 1 !important;
  box-shadow: 6px 0 8px rgba(81, 0, 205, 0.15);
  backdrop-filter: blur(100px);
  animation: ${fadeInShadowAnimation} 1s ease-out forwards;
`

// Styled components

const IntroductionCard = styled(NoisyContainer)<{
  showSubItems: boolean
  isComingSoon: boolean
}>`
  min-width: 16rem;
  height: 14.75rem;

  ${({ theme, isComingSoon }) => {
    if (isComingSoon) {
      return css`
        padding: 1.5rem;
        opacity: 0.4;
        pointer-events: none;
        background: ${theme.color.base0};
      `
    }
  }}

  ${({ showSubItems }) => showSubItems && showSubItemsStyles}
`

const ActiveCard = styled(({ isComingSoon, ...props }) =>
  isComingSoon ? <div {...props} /> : <NoisyContainer {...props} />,
)<{
  showSubItems: boolean
  isComingSoon: boolean
}>`
  justify-content: space-between;
  width: 16rem;
  min-height: 17rem;

  ${({ theme, isComingSoon }) => {
    if (isComingSoon) {
      return css`
        padding: 1.5rem;
        opacity: 0.4 !important;
        pointer-events: none;
        background: ${theme.color.base0};
      `
    }
  }}

  ${({ showSubItems }) => showSubItems && showSubItemsStyles}
`

export const StyledMainCard = styled(({ type, isComingSoon, ...props }) => {
  switch (type) {
    case 'active':
      return (
        <ActiveCard type="grain-2" isComingSoon={isComingSoon} {...props} />
      )
    case 'introduction':
      return (
        <IntroductionCard
          type="grain-2"
          isComingSoon={isComingSoon}
          {...props}
        />
      )
    default:
      return null
  }
})`
  display: flex;
  flex-direction: column;
`

export const StyledSubItemCard = styled(NoisyContainer).attrs(() => ({
  type: 'grain-2',
}))`
  display: flex;
  flex-direction: column;
  width: 17rem;
  height: fit-content;
  max-height: 15rem;
  z-index: 0 !important;
  gap: 0.5rem;
  animation:
    ${increaseWidth} 1s ease-in-out,
    ${fadeIn} 1s ease-in-out;
  transition: width 1s ease;
  overflow: hidden;
`
