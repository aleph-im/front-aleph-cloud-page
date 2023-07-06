import {
  Button,
  Icon,
  Logo,
  NavbarLink,
  NavbarLinkList,
  WalletPicker
} from '@aleph-front/aleph-core'
import Link from 'next/link'
import { StyledHeader, StyledButton, StyledNavbar } from './styles'
import { ellipseAddress } from '@/helpers/utils'
import { useHeader } from '@/hooks/pages/useHeader'
import { useEffect } from 'react'

export const Header = () => {
  const { theme, handleConnect, enableConnection, account, isOnPath, displayWalletPicker, setDisplayWalletPicker, accountBalance } =
    useHeader()

  // useEffect(() => {
  //   ;(async () => {
  //     if (!account) {
  //       enableConnection()
  //     }
  //   })()
  // }, [account])

  return (
    <StyledHeader>
      <StyledNavbar
        logo={
          <Link href="/">
            <Logo />
          </Link>
        }
        mobileTopContent={
          account ? (
            <Button
              variant="secondary"
              color="main1"
              kind="neon"
              size="regular"
            >
              <Icon name="meteor" size="md" color={theme.color.main1} />
            </Button>
          ) : (
            <StyledButton onClick={handleConnect}>
              <Icon name="meteor" size="md" color={theme.color.main0} />
            </StyledButton>
          )
        }
      >
        {account ? (
          <>
            <NavbarLinkList withSlash>
              <NavbarLink isActive={isOnPath('/')}>
                <Link key="solutions" href="/">
                  Solutions
                </Link>
              </NavbarLink>
              <NavbarLink isActive={isOnPath('/dashboard')}>
                <Link key="dashboard" href="/dashboard">
                  Dashboard
                </Link>
              </NavbarLink>
            </NavbarLinkList>
            <NavbarLinkList onlyDesktop>
              <NavbarLink>
                <StyledButton key="link" forwardedAs="button" disabled>
                  <Icon name="ethereum" />
                </StyledButton>
              </NavbarLink>
              <div tw="relative">
                <NavbarLink>
                  <Button
                    as="button"
                    variant="secondary"
                    color="main1"
                    kind="neon"
                    size="regular"
                    onClick={() => setDisplayWalletPicker(!displayWalletPicker)}
                  >
                    {ellipseAddress(account.address)}{' '}
                    <Icon
                      name="meteor"
                      size="lg"
                      tw="ml-2.5"
                      color={theme.color.main1}
                    />
                  </Button>
                </NavbarLink>

                <div tw="absolute right-0 mt-10">
                    {
                      displayWalletPicker && 
                        <WalletPicker
                          networks={[
                            {
                              icon: 'ethereum',
                              name: 'Ethereum',
                              wallets: [
                                {
                                  color: 'orange',
                                  icon: 'circle',
                                  name: 'Metamask',
                                  provider: () => window.ethereum
                                }
                              ]
                            }
                          ]}
                          onConnect={handleConnect}
                          onDisconnect={handleConnect}
                          size="regular"
                          address={account?.address}
                          addressHref={`https://explorer.aleph.im/address/ETH/${account?.address}`}
                          balance={accountBalance}
                        />
                    }
                </div>
              </div>
            </NavbarLinkList>
          </>
        ) : (
          <>
            <NavbarLinkList withSlash>
              <NavbarLink>
                <Link key="solutions" href="/">
                  Solutions
                </Link>
              </NavbarLink>
              <NavbarLink>
                <span key="dashboard" style={{ opacity: 0.5 }}>
                  Dashboard
                </span>
              </NavbarLink>
            </NavbarLinkList>
            <NavbarLinkList onlyDesktop>
              <NavbarLink>
                <StyledButton key="link" forwardedAs="button" disabled>
                  <Icon name="link-simple-slash" />
                </StyledButton>
              </NavbarLink>

              <div tw="relative">
                <NavbarLink>
                  <StyledButton onClick={() => setDisplayWalletPicker(!displayWalletPicker)} forwardedAs="button">
                    Connect{' '}
                    <Icon
                      name="meteor"
                      size="lg"
                      tw="ml-2.5"
                      color={theme.color.main0}
                    />
                  </StyledButton>
                  <div tw="absolute right-0 mt-10">
                  {
                    displayWalletPicker && 
                      <WalletPicker
                        networks={[
                          {
                            icon: 'ethereum',
                            name: 'Ethereum',
                            wallets: [
                              {
                                color: 'orange',
                                icon: 'circle',
                                name: 'Metamask',
                                provider: () => window.ethereum
                              }
                            ]
                          }
                        ]}
                        onConnect={handleConnect}
                        onDisconnect={handleConnect}
                        size="regular"
                      />
                  }
                  </div>
                </NavbarLink>
              </div>
            </NavbarLinkList>
          </>
        )}
      </StyledNavbar>
    </StyledHeader>
  )
}

export default Header
