import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledContainer = styled.div`
  ${({ theme }) => css`
    ${tw`px-3 py-1.5`}

    background: ${theme.color.main0}10;
  `}
`

export const StyledContent = styled.div<{
  $disabled?: boolean
  children?: ReactNode
}>`
  ${tw`max-w-full`}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.4;
      filter: grayscale(100%);
    `}
`
