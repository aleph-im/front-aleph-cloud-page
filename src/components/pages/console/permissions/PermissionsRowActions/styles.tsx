import styled from 'styled-components'
import tw, { css } from 'twin.macro'
import { FloatPosition } from '@aleph-front/core'

export type StyledPortalProps = {
  $position: FloatPosition
  $isOpen: boolean
}

export const StyledPortal = styled.div<StyledPortalProps>`
  ${({ theme, $position: { x, y }, $isOpen }) => {
    return css`
      ${tw`fixed -top-1.5 left-1.5 z-20`}
      min-width: 8rem;
      background: ${theme.color.background};
      box-shadow: 0px 4px 24px ${theme.color.main0}26;
      backdrop-filter: blur(50px);
      transform: ${`translate3d(${x}px, ${y}px, 0)`};
      opacity: ${$isOpen ? 1 : 0};
      will-change: opacity transform;
      transition: opacity ease-in-out 250ms 0s;
    `
  }}
`

export const RowActionsButton = styled.button`
  ${tw`w-12 h-10`};

  ${({ theme, disabled }) => css`
    background: ${theme.color.background};
    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: 0px 4px 24px ${theme.color.main0}26;
      backdrop-filter: blur(50px);
    }

    ${disabled && tw`opacity-40 cursor-not-allowed`}
  `})
`

export const ActionButton = styled.button`
  ${({ theme }) => {
    return css`
      &:hover {
        background-color: ${theme.color.purple2};
      }
    `
  }}
`
