import { Button } from '@aleph-front/core'
import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledH1Button = styled(Button).attrs((props) => {
  return {
    ...props,
    variant: 'secondary',
    size: 'lg',
    kind: 'default',
    color: 'main0',
  }
})``

export const StyledLinkItem = styled.li<{ last?: boolean }>`
  ${({ last }) => (last ? tw`mt-6` : tw`my-6`)}
  ${tw`p-0`}
  line-height: 0;
`

export const StyledLink = styled(Button).attrs((props) => {
  return {
    ...props,
    forwardedAs: 'a',
    kind: 'default',
    variant: 'textOnly',
    size: 'md',
    color: 'main0',
  }
})``
