import React from 'react'
import { Button, Icon } from '@aleph-front/aleph-core'
import { StyledHeader, StyledButton, StyledNavbar } from './styles'
import { HeaderProps } from './types'

export const Header = (props: HeaderProps) => {
  return (
    <StyledHeader>
      <StyledNavbar
        navLinks={[
          <a key="solutions" href="#">Solutions</a>,
          <a key="dashboard" href="#">Dashboard</a>,
        ]}
        navButtons={[
          <StyledButton key="link" forwardedAs="a" disabled><Icon name="link-simple-slash" /></StyledButton>,
          <StyledButton key="connect" forwardedAs="a">Connect <Icon name="meteor" size='lg' className='ml-xs' /></StyledButton>,
        ]}
      />
    </StyledHeader>
  )
}

export default Header
