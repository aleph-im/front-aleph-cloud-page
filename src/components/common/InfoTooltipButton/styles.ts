import { Button } from '@aleph-front/core'
import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledInfoTooltipButton = styled(Button).attrs((props) => {
  return {
    ...props,
    forwardedAs: 'span',
    onClick: (e: MouseEvent) => e.preventDefault(),
    kind: 'neon',
    size: 'big',
    variant: 'text-only',
    color: 'main0',
  }
})(() => [tw`!cursor-help`])
