import { Button, Icon, Logo, NavbarLink, NavbarLinkList } from '@aleph-front/aleph-core'
import { Chain } from 'aleph-sdk-ts/dist/messages/message'
import { ETHAccount } from 'aleph-sdk-ts/dist/accounts/ethereum'
import Link from 'next/link'
import { ethers } from 'ethers'

import { StyledHeader, StyledButton, StyledNavbar } from './styles'
import { HeaderProps } from './types'
import { web3Connect, getAccountBalance, getAccountProducts } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { ellipseAddress } from '@/helpers/utils'
import { useAppState } from '@/contexts/appState'
import { useTheme } from 'styled-components'
import { useEffect } from 'react'

export const Header = (props: HeaderProps) => {
  const [state, dispatch] = useAppState()
  const theme = useTheme()

  useEffect(() => {
      (async () => {
          if(!state.account && (window?.ethereum as any).isConnected()) {
              const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' })
              const ethAccount = ethers.utils.getAddress(accounts[0])
              const account = new ETHAccount((window?.ethereum as any), ethAccount)
              dispatch({ type: ActionTypes.connect, payload: { account } })
              await getBalance(account)
              await getProducts(account)
          }
      })()
  }, [state.account])

  const login = async () => {
    const account = await web3Connect(Chain.ETH, window?.ethereum)
    dispatch({ type: ActionTypes.connect, payload: { account } })

    await getBalance(account)
    await getProducts(account)
  }

    const getBalance = async (account: any) => {
        const balance = await getAccountBalance(account)
        dispatch({ type: ActionTypes.setAccountBalance, payload: { balance } })
    }

    const getProducts = async (account: any) => {
        const products = await getAccountProducts(account)
        dispatch({ type: ActionTypes.setProducts, payload: { products } })
    }

  return (
    <StyledHeader>
      <StyledNavbar
        logo={
          <Link href="/"><Logo /></Link>
        }
        mobileTopContent={state.account?.address ? (
          <Button variant="secondary" color="main1" kind="neon" size="regular"><Icon name="meteor" size="md" color={theme.color.main1} /></Button>
        ) : (
          <StyledButton onClick={login}><Icon name="meteor" size="md" color={theme.color.main0}/></StyledButton>
        )}
      >
        {(state.account?.address ? (
          <>
            <NavbarLinkList withSlash>
              <NavbarLink><Link key="solutions" href="/">Solutions</Link></NavbarLink>
              <NavbarLink><Link key="dashboard" href="/solutions/dashboard">Dashboard</Link></NavbarLink>
            </NavbarLinkList>
            <NavbarLinkList onlyDesktop>
              <NavbarLink><StyledButton key="link" forwardedAs="button" disabled><Icon name="ethereum" /></StyledButton></NavbarLink>
              <NavbarLink><Button as="button" variant="secondary" color="main1" kind="neon" size="regular">{ellipseAddress(state.account?.address)} <Icon name="meteor" size="lg" className="ml-xs" color={theme.color.main1}/></Button></NavbarLink>
            </NavbarLinkList>
          </>
        ) : (
          <>
            <NavbarLinkList withSlash>
              <NavbarLink><Link key="solutions" href="/">Solutions</Link></NavbarLink>
              <NavbarLink><span key="dashboard" style={{ opacity: .5 }}>Dashboard</span></NavbarLink>
            </NavbarLinkList>
            <NavbarLinkList onlyDesktop>
              <NavbarLink><StyledButton key="link" forwardedAs="button" disabled><Icon name="link-simple-slash" /></StyledButton></NavbarLink>
              <NavbarLink><StyledButton onClick={login} forwardedAs="button">Connect <Icon name="meteor" size="lg" className="ml-xs" color={theme.color.main0}/></StyledButton></NavbarLink>
            </NavbarLinkList>
          </>
        )
        )}
      </StyledNavbar>
    </StyledHeader >
  )
}

export default Header
