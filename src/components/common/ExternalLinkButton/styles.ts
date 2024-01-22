import { Button } from '@aleph-front/core'
import styled from 'styled-components'

export const StyledExternalLinkButton = styled(Button).attrs((props) => {
  return {
    ...props,
    forwardedAs: 'a',
    kind: 'default',
    variant: 'textOnly',
    color: 'main0',
  }
})``
