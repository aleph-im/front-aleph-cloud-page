import { TextGradient, getTypoCss, getResponsiveCss } from '@aleph-front/aleph-core'
import styled, { css } from 'styled-components'

export const StyledH1 = styled(TextGradient).attrs(props => {
  return {
    ...props,
    forwardedAs: "h1",
    color: props.color || 'main1'
  }
})`
${getTypoCss('h4')}
  ${getResponsiveCss('md', css`
    ${getTypoCss('h1')}
  `)}
`
