import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { themes, GlobalStyles } from '@aleph-front/aleph-core'
import Footer from '@/components/common/Footer'
import { GlobalStylesOverride } from '@/styles/global'
import Header from '@/components/common/Header'

import NotificationProvider from '@/components/common/NotificationProvider'
import { AppStateProvider } from '@/contexts/appState'
import Main from '@/components/common/Main'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={themes.dark}>
      <GlobalStyles />
      <GlobalStylesOverride />
      <AppStateProvider>
        <NotificationProvider>
          <Header />
          <Main>
            <Component {...pageProps} />
          </Main>
          <Footer small={true} />
        </NotificationProvider>
      </AppStateProvider>
    </ThemeProvider>
  )
}
