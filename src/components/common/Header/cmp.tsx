import {
  Button,
  Icon,
  Logo,
  NavbarLink,
  NavbarLinkList,
  WalletPicker,
} from '@aleph-front/aleph-core'
import Link from 'next/link'
import { StyledHeader, StyledButton, StyledNavbar } from './styles'
import { ellipseAddress } from '@/helpers/utils'
import { useHeader } from '@/hooks/pages/useHeader'
import { useEffect, useRef, useState } from 'react'

export const Header = () => {
  const {
    theme,
    handleConnect,
    account,
    isOnPath,
    displayWalletPicker,
    setDisplayWalletPicker,
    accountBalance,
  } = useHeader()
  const [isDivClicked, setDivClicked] = useState(false)
  const divRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setDisplayWalletPicker(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleDisplayWalletPicker = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation()
    setDisplayWalletPicker(!displayWalletPicker)
  }

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
              {account ? (
                <Button
                  as="button"
                  variant="secondary"
                  color="main1"
                  kind="neon"
                  size="regular"
                  onClick={handleDisplayWalletPicker}
                >
                  {ellipseAddress(account.address)}{' '}
                  <Icon
                    name="meteor"
                    size="lg"
                    tw="ml-2.5"
                    color={theme.color.main1}
                  />
                </Button>
              ) : (
                <Button
                  as="button"
                  variant="secondary"
                  color="main1"
                  kind="neon"
                  size="regular"
                  onClick={handleDisplayWalletPicker}
                >
                  Connect{' '}
                  <Icon
                    name="meteor"
                    size="lg"
                    tw="ml-2.5"
                    color={theme.color.main0}
                  />
                </Button>
              )}
              <div tw="absolute right-0 mt-10" ref={divRef}>
                {displayWalletPicker && (
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
                            provider: () => window.ethereum,
                          }
                        ],
                      },
                    ]}
                    onConnect={handleConnect}
                    onDisconnect={handleConnect}
                    address={account?.address}
                    size="regular"
                  />
                )}
              </div>
            </NavbarLink>
          </div>
        </NavbarLinkList>
      </StyledNavbar>
    </StyledHeader>
  )
}

export default Header
