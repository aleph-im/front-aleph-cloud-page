import {
  Button,
  Icon,
  Logo,
  NavbarLink,
  NavbarLinkList,
} from '@aleph-front/aleph-core'
import Link from 'next/link'
import { StyledHeader, StyledButton, StyledNavbar } from './styles'
import { ellipseAddress } from '@/helpers/utils'
import { useHeader } from '@/hooks/pages/useHeader'

export const Header = () => {
  const { theme, handleConnect, account, isOnPath } = useHeader()

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
              <NavbarLink>
                <Button
                  as="button"
                  variant="secondary"
                  color="main1"
                  kind="neon"
                  size="regular"
                  onClick={handleConnect}
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
              <NavbarLink>
                <StyledButton onClick={handleConnect} forwardedAs="button">
                  Connect{' '}
                  <Icon
                    name="meteor"
                    size="lg"
                    tw="ml-2.5"
                    color={theme.color.main0}
                  />
                </StyledButton>
              </NavbarLink>
            </NavbarLinkList>
          </>
        )}
      </StyledNavbar>
    </StyledHeader>
  )
}

export default Header
