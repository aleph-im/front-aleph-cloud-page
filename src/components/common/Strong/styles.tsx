import { TextGradient, addClasses } from '@aleph-front/aleph-core'
import styled from 'styled-components'

export const StyledStrong = styled(TextGradient).attrs((props) => {
  return {
    ...addClasses('tp-body2')(props),
    forwardedAs: 'strong',
    type: 'body',
    color: props.color || 'main0',
  }
})`
  font-size: 1em !important;
  opacity: 0.7;
`
