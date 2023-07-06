import { Button, Navbar } from '@aleph-front/aleph-core'
import styled from 'styled-components'

export const StyledHeader = styled.header`
  font-size: inherit;
  line-height: inherit;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  /* background-color: #141327CC; */
`

export const StyledNavbar = styled(Navbar)`
  position: relative;
`

export const StyledButton = styled(Button).attrs((props) => {
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
