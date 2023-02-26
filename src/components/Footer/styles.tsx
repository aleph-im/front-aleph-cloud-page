import { Button, getResponsiveCss, getTypoCss, Icon } from '@aleph-front/aleph-core'
import styled, {
  css,
} from 'styled-components'

export const StyledFooter = styled.footer`
  background-color: #00000033;
  width: 100%;
  padding: 82px 62px;
`

export const StyledLogoContainer = styled.div`
  margin-bottom: 50px;
`

export const StyledButton = styled(Button).attrs(props => {
  return {
    ...props,
    kind: 'neon',
    variant: 'tertiary',
    color: 'main0',
    size: 'regular',
    className: `${props.className} mb-lg`
  }
})`
  display: block;
  
  &:last-child {
    margin-bottom: 0;
  }
`

export const StyledAnchor = styled.a.attrs(props => {
  return {
    ...props,
    href: props.href || '#',
    className: `${props.className} mb-lg tp-nav`
  }
})`
  ${({ theme }) => css`
    display: block;
    cursor: pointer;
    font-weight: 700;
    
    color: ${theme.color.text};
    text-decoration: none;

    &:last-child {
      margin-bottom: 0;
    }
  `}
`


export const StyledIcon = styled(Icon).attrs(props => {
  return {
    ...props,
    size: 'lg',
    className: `${props.className} mr-xs`
  }
})``