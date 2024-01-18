import { TextGradient, addClasses } from '@aleph-front/core'
import styled from 'styled-components'

export const StyledH1 = styled(TextGradient).attrs((props) => {
  return {
    ...addClasses('tp-h4 md:tp-h1')(props),
    forwardedAs: 'h1',
    type: 'h4',
    color: props.color || 'main1',
  }
})``
