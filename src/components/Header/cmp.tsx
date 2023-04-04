import { useContext } from 'react'
import { Button, Icon, Logo, NavbarLink, NavbarLinkList } from '@aleph-front/aleph-core'
import { Chain } from 'aleph-sdk-ts/dist/messages/message'
import Link from 'next/link'

import { StyledHeader, StyledButton, StyledNavbar } from './styles'
import { HeaderProps } from './types'
import { web3Connect, getAccountBalance, getAccountProducts } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { ellipseAddress } from '@/helpers/utils'
import { useAppState } from '@/contexts/appState'

export const Header = (props: HeaderProps) => {
  const [ state, dispatch ] = useAppState()

  const login = async () => {
    const account = await web3Connect(Chain.ETH, window?.ethereum)
    dispatch({ type: ActionTypes.connect, payload: { account } })

    const balance = await getAccountBalance(account)
    dispatch({ type: ActionTypes.setAccountBalance, payload: { balance } })

    const products = await getAccountProducts(account)
    dispatch({ type: ActionTypes.setProducts, payload: { products } })
  }

  return (
    <StyledHeader>
      <StyledNavbar logo={<Logo size="2rem" />}>
        {(state.account?.address ? (
          <>
            <NavbarLinkList>
              <NavbarLink withSlash><Link key="solutions" href="/">Solutions</Link></NavbarLink>
              <NavbarLink withSlash><Link key="dashboard" href="/solutions/dashboard">Dashboard</Link></NavbarLink>
            </NavbarLinkList>
            <NavbarLinkList>
              <NavbarLink><StyledButton key="link" forwardedAs="button" disabled><Icon name="ethereum" /></StyledButton></NavbarLink>
              <NavbarLink><Button as="button" variant="secondary" color="main1" kind="neon" size="regular">{ellipseAddress(state.account?.address)} <Icon name="meteor" size="lg" className="ml-xs" /></Button></NavbarLink>
            </NavbarLinkList>
          </>
        )
          : (
            <>
              <NavbarLinkList>
                <NavbarLink withSlash><Link key="solutions" href="/">Solutions</Link></NavbarLink>
                <NavbarLink withSlash><span key="dashboard" style={{ opacity: .5 }}>Dashboard</span></NavbarLink>
              </NavbarLinkList>
              <NavbarLinkList>
                <NavbarLink><StyledButton key="link" forwardedAs="button" disabled><Icon name="link-simple-slash" /></StyledButton></NavbarLink>
                <NavbarLink><StyledButton onClick={login} forwardedAs="button">Connect <Icon name="meteor" size="lg" className="ml-xs" /></StyledButton></NavbarLink>
              </NavbarLinkList>
            </>
          )
        )}
      </StyledNavbar>
    </StyledHeader >
  )
}

export default Header
