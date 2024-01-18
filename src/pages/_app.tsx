import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { themes, GlobalStyles, Footer } from '@aleph-front/core'
import { GlobalStylesOverride } from '@/styles/global'
import Header from '@/components/common/Header'

import NotificationProvider from '@/components/common/NotificationProvider'
import Main from '@/components/common/Main'
import Content from '@/components/Content/cmp'
import Viewport from '@/components/common/Viewport'
import Sidebar from '@/components/common/Sidebar'
import { useRouterLoadState } from '@/hooks/common/useRouterLoadState'
import { AppStateProvider } from '@/contexts/appState'
import Loading from './loading'

export default function App({ Component, pageProps }: AppProps) {
  const { loading } = useRouterLoadState()

  return (
    <ThemeProvider theme={themes.twentysix}>
      <GlobalStyles />
      <GlobalStylesOverride />
      <AppStateProvider>
        <NotificationProvider>
          <Viewport>
            <Sidebar />
            <Main>
              <Header />
              <Content>
                <Component {...pageProps} />
                {loading && <Loading />}
              </Content>
              <Footer small={true} />
            </Main>
          </Viewport>
        </NotificationProvider>
      </AppStateProvider>
    </ThemeProvider>
  )
}
