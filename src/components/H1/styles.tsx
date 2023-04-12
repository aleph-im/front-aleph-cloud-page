import { TextGradient, addClasses } from '@aleph-front/aleph-core'
import styled from 'styled-components'

export const StyledH1 = styled(TextGradient).attrs(props => {
  return {
    ...addClasses('d-iblock tp-h4 tp-h1-md')(props),
    forwardedAs: "h1",
    type: 'h4',
    color: props.color || 'main1'
  }
})`
  display: table;
`
