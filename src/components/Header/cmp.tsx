import { useContext } from 'react'
import { Button, Icon } from '@aleph-front/aleph-core'
import { Chain } from 'aleph-sdk-ts/dist/messages/message'
import Link from 'next/link'

import { StyledHeader, StyledButton, StyledNavbar } from './styles'
import { HeaderProps } from './types'
import { web3Connect, getAccountBalance, getAccountProducts } from '@/helpers/aleph'
import { ActionTypes } from '@/helpers/store'
import { ellipseAddress } from '@/helpers/utils'
import { AppStateContext } from '@/pages/_app'

export const Header = (props: HeaderProps) => {
  const { state, dispatch } = useContext(AppStateContext)

  const login = async () => {
    const account = await web3Connect(Chain.ETH, window?.ethereum)
    dispatch({ type: ActionTypes.connect, payload: {account} })

    const balance = await getAccountBalance(account)
    dispatch({ type: ActionTypes.setAccountBalance, payload: {balance} })

    const products = await getAccountProducts(account)
    dispatch({ type: ActionTypes.setProducts, payload: {products} })
  }

  return (
    <StyledHeader>
      {
        state.account?.address ?
        <StyledNavbar
          navLinks={[
            <Link key="solutions" href="/">Solutions</Link>,
            <Link key="dashboard" href="/solutions/dashboard">Dashboard</Link>
          ]}
          navButtons={[
            <StyledButton key="link" forwardedAs="button" disabled><Icon name="ethereum" /></StyledButton>,
            <Button as="button" variant="secondary" color="main1" kind="neon" size="regular">{ellipseAddress(state.account?.address)} <Icon name="meteor" size="lg" className="ml-xs" /></Button> 
          ]} />
        :
        <StyledNavbar 
          navLinks={[
            <Link key="solutions" href="/">Solutions</Link>,
            <span key="dashboard" style={{opacity: .5}}>Dashboard</span>
          ]}
          navButtons={[
            <StyledButton key="link" forwardedAs="button" disabled><Icon name="link-simple-slash" /></StyledButton>,
            <StyledButton onClick={login} forwardedAs="button">Connect <Icon name="meteor" size="lg" className="ml-xs" /></StyledButton>
          ]} />

      }
    </StyledHeader>
  )
}

export default Header
