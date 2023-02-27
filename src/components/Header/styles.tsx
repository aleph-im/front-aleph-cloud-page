import { Button, Navbar } from '@aleph-front/aleph-core'
import styled from 'styled-components'

export const StyledHeader = styled.header`
  font-size: inherit;
  line-height: inherit;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  background-color: #141327CC;
`

export const StyledNavbar = styled(Navbar).attrs(props => {
  return {
    ...props,
    className: `px-xs-xs px-sm-sm px-md-md px-lg-lg px-xl-xl px-xxl-xxl`
  }
})``

export const StyledButton = styled(Button).attrs(props => {
  return {
    ...props,
    color: 'main0',
    kind: 'neon',
    size: 'regular',
    variant: 'tertiary',
  }
})`
  display: block;
  
  &:last-child {
    margin-bottom: 0;
  }
`
