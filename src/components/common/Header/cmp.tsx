import { memo } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Button, Icon, RenderLinkProps } from '@aleph-front/core'
import { StyledButton, StyledHeader, StyledNavbarDesktop, StyledWalletPicker } from './styles'
import { ellipseAddress } from '@/helpers/utils'
import { useAccountButton, UseAccountButtonProps, useHeader } from '@/hooks/pages/useHeader'
import AutoBreadcrumb from '@/components/common/AutoBreadcrumb'
import { useConnect } from '@/hooks/common/useConnect'
import { Chain } from 'aleph-sdk-ts/dist/messages/types'

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

  return (
    <>
      {account ? (
        <Button
          ref={walletPickerTriggerRef}
          as="button"
          variant="secondary"
          color="main1"
          kind="default"
          size="md"
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
          kind="default"
          size="md"
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
            onDisconnect={() => handleConnect()}
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

const CustomLink = (props: RenderLinkProps) => {
  return props.route.children ? <span {...props} /> : <Link {...props} />
}

// ----------------------------

export const Header = () => {
  const {
    pathname,
    routes,
    breadcrumbNames,
    isOpen,
    breakpoint,
    handleToggle,
    ...accountProps
  } = useHeader()

  const {
    switchNetwork,
    selectedNetwork,
  } = useConnect();

  return (
    <>
      <StyledHeader $breakpoint={breakpoint}>
        <StyledNavbarDesktop $breakpoint={breakpoint}>
          <div>
            <AutoBreadcrumb names={breadcrumbNames} />
          </div>
          <div tw="relative flex items-center justify-center gap-7">
            <StyledButton key="evm" forwardedAs="button" onClick={() => switchNetwork(Chain.ETH)} disabled={selectedNetwork === Chain.ETH}>
              <Icon name="ethereum" color={selectedNetwork === Chain.ETH ? 'main1' : 'main0'} />
            </StyledButton>
            <StyledButton key="avax" forwardedAs="button" onClick={() => switchNetwork(Chain.AVAX)} disabled={selectedNetwork === Chain.AVAX}>
              <Icon name="avalanche" color={selectedNetwork === Chain.AVAX ? 'main1' : 'main0'} />
            </StyledButton>
            <AccountButtonMemo {...accountProps} />
          </div>
        </StyledNavbarDesktop>
      </StyledHeader>
      <div tw="block flex-auto grow-0 shrink-0 h-[6.5rem] lg:hidden"></div>
      <div tw="block lg:hidden my-6 px-5 md:px-16">
        <AutoBreadcrumb names={breadcrumbNames} />
      </div>
    </>
  )
}
Header.displayName = 'Header'

export const CustomLinkMemo = memo(CustomLink)
export const AccountButtonMemo = memo(AccountButton)
export default memo(Header)
