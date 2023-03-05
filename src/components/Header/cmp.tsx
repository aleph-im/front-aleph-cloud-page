import React from 'react'
import { Button, Icon } from '@aleph-front/aleph-core'
import { StyledHeader, StyledButton, StyledNavbar } from './styles'
import { HeaderProps } from './types'
import { useTheme } from 'styled-components'

export const Header = (props: HeaderProps) => {
  const theme = useTheme()

  return (
    <StyledHeader>
      <StyledNavbar
        navLinks={[
          <a key="solutions" href="#">Solutions</a>,
          <a key="dashboard" href="#">Dashboard</a>,
        ]}
        navButtons={[
          <StyledButton key="link" forwardedAs="a" disabled><Icon name="link-simple-slash" /></StyledButton>,
          <StyledButton key="connect" forwardedAs="a">Connect <Icon name="meteor" size='lg' className='ml-xs' color={theme.color.main0} /></StyledButton>,
        ]}
      />
    </StyledHeader>
  )
}

export default Header
