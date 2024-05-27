import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import {
  themes,
  GlobalStyles,
  Notification as NotificationProvider,
  Modal as ModalProvider,
} from '@aleph-front/core'
import { GlobalStylesOverride } from '@/styles/global'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Main from '@/components/common/Main'
import Content from '@/components/common/Content'
import Viewport from '@/components/common/Viewport'
import Sidebar from '@/components/common/Sidebar'
import { AppStateProvider } from '@/contexts/appState'
//import { HeliaProvider } from '@/contexts/helia'
import Loading from './_loading'
import { useRef } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const mainRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <ThemeProvider theme={themes.twentysix}>
      <GlobalStyles />
      <GlobalStylesOverride />
      <AppStateProvider>
        <ModalProvider>
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
                  <Loading />
                </Content>
                <Footer />
              </Main>
            </Viewport>
          </NotificationProvider>
        </ModalProvider>
      </AppStateProvider>
    </ThemeProvider>
  )
}
