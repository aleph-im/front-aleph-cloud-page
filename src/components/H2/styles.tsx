import { addClasses, TextGradient } from '@aleph-front/aleph-core'
import styled from 'styled-components'

export const StyledH2 = styled(TextGradient).attrs((props) => {
  return {
    ...props,
    forwardedAs: 'h2',
    type: 'h5',
    color: props.color || 'main0',
  }
})`
  position: relative;
  display: table;
`

export const StyledLabel = styled.span.attrs(
  addClasses('gr-main0 tp-header fs-md'),
)`
  position: absolute;
  top: -0.25em;
  left: 100%;
  margin-left: 10px;
  padding: 0.375rem 0.75rem;
  mask: linear-gradient(#fff 0 0) text, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
`
