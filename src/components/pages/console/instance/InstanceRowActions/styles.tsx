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
      ${tw`fixed -top-1.5 left-1.5 z-40`}
      min-width: 10rem;
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
  ${tw`w-10 h-10 flex items-center justify-center`};

  ${({ theme, disabled }) => css`
    background: ${theme.color.background};
    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: 0px 4px 24px ${theme.color.main0}26;
      backdrop-filter: blur(50px);
    }

    ${disabled && tw`opacity-40 cursor-not-allowed`}
  `}
`

export const ActionsRow = styled.div`
  ${tw`flex items-center justify-center gap-1 px-3 py-2`}
`

export const ActionIconButton = styled.button<{
  $variant?: 'default' | 'error'
}>`
  ${tw`w-8 h-8 flex items-center justify-center rounded`};

  ${({ theme, disabled, $variant = 'default' }) => css`
    background: transparent;
    transition: all 0.2s ease-in-out;
    color: ${$variant === 'error' ? theme.color.error : theme.color.base2};

    &:hover:not(:disabled) {
      background: ${theme.color.purple2};
      color: ${$variant === 'error' ? theme.color.error : theme.color.main0};
    }

    ${disabled &&
    css`
      ${tw`opacity-40 cursor-not-allowed`}
    `}
  `}
`

export const ManageButton = styled.button`
  ${tw`px-4 py-3 w-full text-left`};

  ${({ theme }) => css`
    &:hover {
      background-color: ${theme.color.purple2};
    }
  `}
`
