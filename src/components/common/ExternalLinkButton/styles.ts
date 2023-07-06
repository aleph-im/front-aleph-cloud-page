import { Button } from '@aleph-front/aleph-core'
import styled from 'styled-components'

export const StyledExternalLinkButton = styled(Button).attrs((props) => {
  return {
    ...props,
    forwardedAs: 'a',
    kind: 'neon',
    variant: 'text-only',
    color: 'main0',
  }
})``
