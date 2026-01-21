import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import {
  themes,
  GlobalStyles,
  Notification as NotificationProvider,
} from '@aleph-front/core'
import { GlobalStylesOverride } from '@/styles/global'
import Header from '@/components/common/Header'
import Main from '@/components/common/Main'
import Content from '@/components/common/Content'
import Viewport from '@/components/common/Viewport'
import Sidebar from '@/components/common/Sidebar'
import { AppStateProvider } from '@/contexts/appState'
import { ReownProvider } from '@/contexts/reownContext'
import useResetScroll from '@/hooks/common/useResetScroll'
import { useRef } from 'react'
import Head from 'next/head'
import '@/config/reown'

export default function App({ Component, pageProps }: AppProps) {
  const mainRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useResetScroll([mainRef, contentRef])

  return (
    <ThemeProvider theme={themes.twentysix}>
      <Head>
        <title>Decentralized compute console | Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your confidential compute resources and decentralized storage on Aleph Cloud. Launch VMs, deploy applications, and monitor usage, all from one dashboard."
        />
      </Head>
      <GlobalStyles />
      <GlobalStylesOverride />
      <ReownProvider>
        <AppStateProvider>
          <NotificationProvider max={10} timeout={2000}>
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
                </Content>
              </Main>
            </Viewport>
          </NotificationProvider>
        </AppStateProvider>
      </ReownProvider>
    </ThemeProvider>
  )
}
