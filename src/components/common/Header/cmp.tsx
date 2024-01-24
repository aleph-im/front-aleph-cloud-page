import { memo } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import {
  Button,
  Icon,
  LinkComponent,
  NavbarLink,
  NavbarLinkList,
  RouterNavbar,
} from '@aleph-front/aleph-core'
import { StyledHeader, StyledButton, StyledWalletPicker } from './styles'
import { ellipseAddress } from '@/helpers/utils'
import {
  UseAccountButtonProps,
  useAccountButton,
  useHeader,
} from '@/hooks/pages/useHeader'
import AutoBreadcrumb from '../AutoBreadcrumb'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'
import { useConnect } from '@/hooks/common/useConnect'

export type AccountButtonProps = UseAccountButtonProps & {
  isMobile?: boolean
}

export const AccountButton = ({ isMobile, ...rest }: AccountButtonProps) => {
  const {
    theme,
    account,
    accountBalance,
    displayWalletPicker,
    walletPickerOpen,
    walletPickerRef,
    walletPickerTriggerRef,
    walletPosition,
    provider,
    handleConnect,
    handleDisplayWalletPicker,
  } = useAccountButton(rest)

  const chainNameToEnum = (chainName: string): Chain => {
    switch (chainName) {
      case 'Ethereum':
        return Chain.ETH
      case 'Avalanche':
        return Chain.AVAX
      default:
        return Chain.ETH
    }
  }

  return (
    <>
      {account ? (
        <Button
          ref={walletPickerTriggerRef}
          as="button"
          variant="secondary"
          color="main1"
          kind="neon"
          size="regular"
          onClick={handleDisplayWalletPicker}
        >
          <div tw="flex items-center gap-2.5">
            {!isMobile && ellipseAddress(account.address)}
            <Icon name="meteor" size="lg" color={theme.color.main1} />
          </div>
        </Button>
      ) : (
        <Button
          ref={walletPickerTriggerRef}
          as="button"
          variant="tertiary"
          color="main0"
          kind="neon"
          size="regular"
          onClick={handleDisplayWalletPicker}
        >
          <div tw="flex items-center gap-2.5">
            {!isMobile && 'Connect'}
            <Icon name="meteor" size="lg" color={theme.color.main0} />
          </div>
        </Button>
      )}
      {displayWalletPicker &&
        createPortal(
          <StyledWalletPicker
            ref={walletPickerRef}
            networks={[
              {
                icon: 'ethereum',
                name: 'Ethereum',
                wallets: [
                  {
                    color: 'orange',
                    icon: 'metamask',
                    name: 'Metamask',
                    provider,
                  },
                ],
              },
              {
                icon: 'avalanche',
                name: 'Avalanche',
                wallets: [
                  {
                    color: 'orange',
                    icon: 'metamask',
                    name: 'Metamask',
                    provider,
                  },
                ],
              }
            ]}
            onConnect={handleConnect}
            onDisconnect={() => handleConnect}
            address={account?.address}
            addressHref={`https://etherscan.io/address/${account?.address}`}
            balance={accountBalance}
            $isOpen={walletPickerOpen}
            $position={walletPosition}
          />,
          document.body,
        )}
    </>
  )
}
AccountButton.displayName = 'AccountButton'

// ----------------------------

export const Header = () => {
  const {
    pathname,
    routes,
    breadcrumbNames,
    hasBreadcrumb,
    isOpen,
    breakpoint,
    handleToggle,
    ...accountProps
  } = useHeader()

  const {
    selectedNetwork,
    handleNetworkSelection
  } = useConnect()

  return (
    <>
      <StyledHeader $breakpoint={breakpoint}>
        <RouterNavbar
          {...{
            routes,
            pathname,
            open: isOpen,
            onToggle: handleToggle,
            Link: Link as LinkComponent,
            height: '6.5rem',
            breakpoint: 'lg',
            mobileTopContent: <AccountButtonMemo {...accountProps} isMobile />,
          }}
        >
          <NavbarLinkList breakpoint={breakpoint} onlyDesktop>
            <NavbarLink breakpoint={breakpoint}>
              <StyledButton key="link" forwardedAs="button" disabled>
                <Icon name="ethereum" />
              </StyledButton>
            </NavbarLink>
            <AccountButtonMemo {...accountProps} />
          </NavbarLinkList>
        </RouterNavbar>
      </StyledHeader>
      <div tw="block flex-auto grow-0 shrink-0 h-[6.5rem] lg:hidden"></div>
      {hasBreadcrumb && (
        <div tw="block my-6 px-5 md:px-16">
          <AutoBreadcrumb names={breadcrumbNames} />
        </div>
      )}
    </>
  )
}
Header.displayName = 'Header'

export const AccountButtonMemo = memo(AccountButton)
export default memo(Header)
