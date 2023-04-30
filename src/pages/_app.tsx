import '../styles/font.css'

// @IMPORTANT: Read https://fontawesome.com/docs/web/use-with/react/use-with#next-js
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { themes, GlobalStyles } from '@aleph-front/aleph-core'
import Footer from '@/components/Footer'
import { GlobalStylesOverride } from '@/styles/global'
import Header from '@/components/Header'

import NotificationProvider from '@/components/NotificationProvider'
import { AppStateProvider } from '@/contexts/appState'
import AutoBreadcrumb from '@/components/AutoBreadcrumb/cmp'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={themes.dark}>
      <GlobalStyles />
      <GlobalStylesOverride />
      <AppStateProvider>
        <NotificationProvider>
          <Header />
          <main>
            <AutoBreadcrumb homeName="solutions" tw="py-5 px-6 md:px-16" />
            <Component {...pageProps} />
          </main>
          <Footer small={true} />
        </NotificationProvider>
      </AppStateProvider>
    </ThemeProvider>
  )
}
