import { NoisyContainer } from '@aleph-front/core'
import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledContainer = styled(NoisyContainer).attrs({
  type: 'grain-3',
})`
  ${tw`p-6 relative max-w-full h-full`}
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
