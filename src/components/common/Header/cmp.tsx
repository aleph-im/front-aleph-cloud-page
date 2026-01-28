import { memo, useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AccountPicker,
  Button,
  Icon,
  Logo,
  RenderLinkProps,
  TextInput,
} from '@aleph-front/core'
import { StyledHeader, StyledNavbarDesktop, StyledNavbarMobile } from './styles'
import { useHeader } from '@/components/common/Header/hook'
import AutoBreadcrumb from '@/components/common/AutoBreadcrumb'
import { NAVIGATION_URLS, websiteUrl } from '@/helpers/constants'
import { blockchains } from '@/domain/connect'
import { useEnsNameLookup } from '@/hooks/common/useENSLookup'
import LoadingProgress from '../LoadingProgres'
import { useSettings } from '@/hooks/common/useSettings'
import { useTopUpCreditsModal } from '@/components/modals/TopUpCreditsModal/hook'
import { formatCredits } from '@/helpers/utils'

const CustomLink = (props: RenderLinkProps) => {
  return props.route.children ? <span {...props} /> : <Link {...props} />
}

const Settings = () => {
  const { apiServerDisplay, handleSetApiServer } = useSettings()

  const preferredServers = ['api.aleph.im', 'api2.aleph.im', 'api3.aleph.im']

  const isCustomServer = !preferredServers.includes(apiServerDisplay)
  const serverList = isCustomServer
    ? [...preferredServers, apiServerDisplay]
    : preferredServers

  const [currentView, setCurrentView] = useState<'main' | 'apiServer'>('main')
  const setView = useCallback((view: 'main' | 'apiServer') => {
    setCurrentView(view)
  }, [])

  const [customApiServer, setCustomApiServer] = useState<string>('')
  const handleCustomApiServerChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomApiServer(event.target.value)
    },
    [],
  )

  const setApiServer = useCallback(
    (server: string) => {
      handleSetApiServer(server)
    },
    [handleSetApiServer],
  )

  return (
    <div tw="w-[18rem]">
      <div tw="w-full h-fit">
        {currentView === 'main' ? (
          <button
            tw="cursor-pointer flex items-center w-full justify-between px-2"
            className="group tp-body3"
            onClick={() => setView('apiServer')}
          >
            {apiServerDisplay}
            <Icon
              name="chevron-right"
              tw="ml-2 group-hover:translate-x-1 transition-all duration-300"
            />
          </button>
        ) : currentView === 'apiServer' ? (
          <div>
            <div tw="relative w-full flex items-center justify-between">
              <button
                tw="absolute cursor-pointer flex items-center justify-between"
                className="group"
                onClick={() => setView('main')}
              >
                <Icon
                  name="chevron-left"
                  tw="group-hover:-translate-x-1 transition-all duration-300"
                />
              </button>
              <p tw="w-full text-center" className="tp-body3 text-base2">
                API Servers
              </p>
              <div />
            </div>
            <div tw="flex flex-col gap-6 mt-8">
              {serverList.map((server) => (
                <button
                  key={server}
                  tw="flex items-center justify-between"
                  className="group"
                  onClick={() => setApiServer(server)}
                >
                  <p
                    tw="group-hover:scale-105 transition-all duration-300"
                    className={`tp-body3 ${apiServerDisplay === server ? 'text-main0' : 'text-base2'} `}
                  >
                    {server}
                  </p>
                  <Icon
                    name="check-circle"
                    color={apiServerDisplay === server ? 'main0' : 'disabled'}
                    size="lg"
                    tw="group-hover:scale-125 transition-all duration-300"
                  />
                </button>
              ))}
            </div>
            <div tw="mt-8">
              <p className="text-base2" tw="mb-3">
                Custom
              </p>
              <TextInput
                value={customApiServer}
                name="custom-api-server"
                placeholder="api.aleph.im"
                onChange={handleCustomApiServerChange}
                button={
                  <Button onClick={() => setApiServer(customApiServer)}>
                    <Icon name="check" />
                  </Button>
                }
              />
              <div tw="mt-3 flex items-center gap-4">
                <Icon name="info-circle" color="main0" size="md" />
                <div>
                  <p className="text-main0">
                    Accepts bare hostnames (e.g. api.example.com) or full URLs.
                  </p>
                  <p className="text-main0">
                    Full URLs are stored as their origin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
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
    rewards,
    selectedNetwork,
    handleToggle,
    handleConnect,
    handleDisconnect,
    handleSwitchNetwork,
  } = useHeader()

  const ensName = useEnsNameLookup(accountAddress)
  const { handleOpen } = useTopUpCreditsModal()

  // Format credits as USD for display
  const formattedCredits = useMemo(
    () =>
      accountCreditBalance !== undefined
        ? formatCredits(accountCreditBalance)
        : undefined,
    [accountCreditBalance],
  )

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
                showCredits
                accountCredits={formattedCredits}
                blockchains={blockchains}
                networks={networks}
                selectedNetwork={selectedNetwork}
                rewards={rewards}
                ensName={ensName}
                settingsContent={<Settings />}
                handleConnect={handleConnect}
                handleDisconnect={handleDisconnect}
                handleSwitchNetwork={handleSwitchNetwork}
                handleTopUpClick={handleOpen}
                externalUrl={{
                  text: 'Legacy console',
                  url: NAVIGATION_URLS.legacyConsole.home,
                }}
                showSettings
                Link={CustomLinkMemo}
              />
            ),
            logoHref: websiteUrl,
            logoTarget: '_blank',
            logo: (
              <Link href="/">
                <Logo img="aleph" text="Aleph Cloud" byAleph={false} />
              </Link>
            ),
          }}
        />
        <StyledNavbarDesktop $breakpoint={breakpoint}>
          <AutoBreadcrumb names={breadcrumbNames} />
          <AccountPicker
            accountAddress={accountAddress}
            accountBalance={accountBalance}
            showCredits
            accountCredits={formattedCredits}
            blockchains={blockchains}
            networks={networks}
            selectedNetwork={selectedNetwork}
            rewards={rewards}
            ensName={ensName}
            settingsContent={<Settings />}
            handleConnect={handleConnect}
            handleDisconnect={handleDisconnect}
            handleSwitchNetwork={handleSwitchNetwork}
            handleTopUpClick={handleOpen}
            externalUrl={{
              text: 'Legacy console',
              url: NAVIGATION_URLS.legacyConsole.home,
            }}
            showSettings
            Link={CustomLinkMemo}
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
