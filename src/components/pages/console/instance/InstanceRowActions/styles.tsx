import styled from 'styled-components'
import tw, { css } from 'twin.macro'

export const ActionsContainer = styled.div`
  ${tw`flex items-center gap-1`}
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
