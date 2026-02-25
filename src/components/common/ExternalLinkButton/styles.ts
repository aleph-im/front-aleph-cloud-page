import { Button, ButtonProps } from '@aleph-front/core'
import styled from 'styled-components'

export const StyledExternalLinkButton = styled(Button).attrs(
  (props: { variant?: ButtonProps['variant'] }) => {
    return {
      ...props,
      forwardedAs: 'a',
      kind: 'default',
      variant: props.variant || 'textOnly',
      color: 'main0',
    }
  },
)``
