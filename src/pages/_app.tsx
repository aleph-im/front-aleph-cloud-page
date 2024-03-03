import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { themes, GlobalStyles } from '@aleph-front/core'
import { GlobalStylesOverride } from '@/styles/global'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import NotificationProvider from '@/components/common/NotificationProvider'
import Main from '@/components/common/Main'
import Content from '@/components/common/Content'
import Viewport from '@/components/common/Viewport'
import Sidebar from '@/components/common/Sidebar'
import { AppStateProvider } from '@/contexts/appState'
import Loading from './loading'
import { useRef } from 'react'
import { WalletConnectProvider } from '@/contexts/walletConnect'

export default function App({ Component, pageProps }: AppProps) {
  const mainRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <ThemeProvider theme={themes.twentysix}>
      <GlobalStyles />
      <GlobalStylesOverride />
      <AppStateProvider>
        <WalletConnectProvider>
          <NotificationProvider>
            <Viewport>
              <Sidebar />
              <Main ref={mainRef}>
                <Header />
                <Content ref={contentRef}>
                  <Component
                    {...{
                      ...pageProps,
                      mainRef,
                      contentRef,
                    }}
                  />
                  <Loading />
                </Content>
                <Footer />
              </Main>
            </Viewport>
          </NotificationProvider>
        </WalletConnectProvider>
      </AppStateProvider>
    </ThemeProvider>
  )
}
