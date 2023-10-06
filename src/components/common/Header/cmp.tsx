import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Button,
  Icon,
  Logo,
  NavbarLink,
  NavbarLinkList,
  WalletPicker,
  useClickOutside,
} from '@aleph-front/aleph-core'
import { StyledHeader, StyledButton, StyledNavbar } from './styles'
import { ellipseAddress } from '@/helpers/utils'
import { useHeader } from '@/hooks/pages/useHeader'
import { useConnect } from '@/hooks/common/useConnect'

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

  const { connect } = useConnect()

  const divRef = useRef<HTMLDivElement>(null)

  useClickOutside(() => {
    if (displayWalletPicker) setDisplayWalletPicker(false)
  }, [divRef])

  const handleDisplayWalletPicker = () => {
    setDisplayWalletPicker(!displayWalletPicker)
  }

  const provider = () => {
    window.ethereum?.on('accountsChanged', function () {
      connect()
    })

    return window.ethereum
  }

  // @todo: handle this on the provider method of the WalletConnect component
  // the provider function should initialize the provider and return a dispose function
  useEffect(() => {
    provider()
    return () => {
      window.ethereum?.removeListener('accountsChanged', () => {
        connect()
      })
    }
  }, [])

  const [isOpen, setIsOpen] = useState(false)

  const handleToggleOpen = useCallback((open: boolean) => {
    setIsOpen(open)
  }, [])

  const handleCloseMenu = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  return (
    <StyledHeader>
      <StyledNavbar
        open={isOpen}
        onToggle={handleToggleOpen}
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
        <NavbarLinkList withSlash onClick={handleCloseMenu}>
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
                  variant="tertiary"
                  color="main0"
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
                            provider,
                          },
                        ],
                      },
                    ]}
                    onConnect={handleConnect}
                    onDisconnect={handleConnect}
                    address={account?.address}
                    addressHref={`https://etherscan.io/address/${account?.address}`}
                    balance={accountBalance}
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
