import { memo } from 'react'
import Link from 'next/link'
import { AccountPicker, RenderLinkProps } from '@aleph-front/core'
import { StyledHeader, StyledNavbarDesktop, StyledNavbarMobile } from './styles'
import { useHeader } from '@/components/common/Header/hook'
import AutoBreadcrumb from '@/components/common/AutoBreadcrumb'
import { NAVIGATION_URLS, websiteUrl } from '@/helpers/constants'
import { blockchains } from '@/domain/connect/base'
import { useEnsNameLookup } from '@/hooks/common/useENSLookup'
import LoadingProgress from '../LoadingProgres'

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
    networks,
    accountAddress,
    accountBalance,
    accountCreditBalance,
    accountVouchers,
    rewards,
    selectedNetwork,
    handleToggle,
    handleConnect,
    handleDisconnect,
    handleSwitchNetwork,
  } = useHeader()

  const ensName = useEnsNameLookup(accountAddress)

  return (
    <>
      <StyledHeader $breakpoint={breakpoint}>
        <LoadingProgress breakpoint={breakpoint} />
        <StyledNavbarMobile
          {...{
            routes,
            pathname,
            open: isOpen,
            onToggle: handleToggle,
            Link: CustomLinkMemo,
            height: '6.5rem',
            breakpoint: 'lg',
            mobileTopContent: (
              <AccountPicker
                isMobile
                accountAddress={accountAddress}
                accountBalance={accountBalance}
                accountCredits={accountCreditBalance}
                accountVouchers={accountVouchers}
                blockchains={blockchains}
                networks={networks}
                selectedNetwork={selectedNetwork}
                rewards={rewards}
                ensName={ensName}
                handleConnect={handleConnect}
                handleDisconnect={handleDisconnect}
                handleSwitchNetwork={handleSwitchNetwork}
                Link={CustomLinkMemo}
                externalUrl={{
                  text: 'Legacy console',
                  url: 'https://app.aleph.cloud/',
                }}
              />
            ),
            logoHref: websiteUrl,
            logoTarget: '_blank',
          }}
        />
        <StyledNavbarDesktop $breakpoint={breakpoint}>
          <AutoBreadcrumb names={breadcrumbNames} />
          <AccountPicker
            accountAddress={accountAddress}
            accountBalance={accountBalance}
            accountCredits={accountCreditBalance}
            accountVouchers={accountVouchers}
            blockchains={blockchains}
            networks={networks}
            selectedNetwork={selectedNetwork}
            rewards={rewards}
            ensName={ensName}
            handleConnect={handleConnect}
            handleDisconnect={handleDisconnect}
            handleSwitchNetwork={handleSwitchNetwork}
            Link={CustomLinkMemo}
            externalUrl={{
              text: 'Legacy console',
              url: NAVIGATION_URLS.legacyConsole.home,
            }}
          />
        </StyledNavbarDesktop>
      </StyledHeader>
      <div tw="block flex-auto grow-0 shrink-0 h-[6.5rem] lg:hidden"></div>
      <div tw="block lg:hidden my-6 px-6 lg:px-16">
        <AutoBreadcrumb names={breadcrumbNames} />
      </div>
    </>
  )
}
Header.displayName = 'Header'

export const CustomLinkMemo = memo(CustomLink)
export default memo(Header)
