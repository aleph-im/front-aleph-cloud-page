import { memo } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Button, Icon, RenderLinkProps } from '@aleph-front/core'
import {
  StyledNavbarDesktop,
  StyledButton,
  StyledWalletPicker,
  StyledNavbarMobile,
  StyledHeader,
} from './styles'
import { ellipseAddress } from '@/helpers/utils'
import {
  UseAccountButtonProps,
  useAccountButton,
  useHeader,
} from '@/hooks/pages/useHeader'
import AutoBreadcrumb from '@/components/common/AutoBreadcrumb'

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
      <Button
        ref={walletPickerTriggerRef}
        as="button"
        kind="yellow"
        variant="primary"
        size="md"
        onClick={handleDisplayWalletPicker}
      >
        <div tw="flex items-center gap-2.5">
          {!isMobile && (account ? ellipseAddress(account.address) : 'Connect')}
          <Icon name="meteor" size="lg" />
        </div>
      </Button>
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
              },
            ]}
            onConnect={handleConnect}
            onDisconnect={handleConnect}
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

  return (
    <>
      <StyledHeader $breakpoint={breakpoint}>
        <StyledNavbarMobile
          {...{
            routes,
            pathname,
            open: isOpen,
            onToggle: handleToggle,
            Link: CustomLinkMemo,
            height: '6.5rem',
            breakpoint: 'lg',
            mobileTopContent: <AccountButtonMemo {...accountProps} isMobile />,
          }}
        />
        <StyledNavbarDesktop $breakpoint={breakpoint}>
          <div>
            <AutoBreadcrumb names={breadcrumbNames} />
          </div>
          <div tw="relative flex items-center justify-center gap-7">
            <StyledButton key="link" forwardedAs="button" disabled>
              <Icon name="ethereum" size="xl" tw="w-6" prefix="custom" />
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
