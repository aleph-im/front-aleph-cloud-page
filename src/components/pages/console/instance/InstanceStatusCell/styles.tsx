import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export type StatusIconVariant = 'success' | 'warning' | 'error' | 'loading'

export const StyledStatusIcon = styled.div<{ $variant: StatusIconVariant }>`
  ${tw`flex items-center justify-center rounded-full`}
  width: 1.75rem;
  height: 1.75rem;

  ${({ theme, $variant }) => {
    const colors = {
      success: theme.color.success,
      warning: theme.color.warning,
      error: theme.color.error,
      loading: theme.color.main0,
    }

    const color = colors[$variant]

    return css`
      border: 2px solid ${color};
      color: ${color};
      background-color: ${theme.color.white};
    `
  }}
`
