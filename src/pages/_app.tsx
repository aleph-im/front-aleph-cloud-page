import '../styles/font.css'

// @IMPORTANT: Read https://fontawesome.com/docs/web/use-with/react/use-with#next-js
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { themes, GlobalStyles } from '@aleph-front/aleph-core'
import Footer from '@/components/common/Footer'
import { GlobalStylesOverride } from '@/styles/global'
import Header from '@/components/common/Header'

import NotificationProvider from '@/components/common/NotificationProvider'
import { AppStateProvider } from '@/contexts/appState'
import AutoBreadcrumb from '@/components/common/AutoBreadcrumb/cmp'
import { breadcrumbNames } from '@/helpers/constants'
import { useRouter } from 'next/router'
import Main from '@/components/common/Main'
import { HeliaProvider } from '@/contexts/helia'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const hasBreadcrumb = router.pathname !== '/dashboard/manage'

  return (
    <ThemeProvider theme={themes.dark}>
      <GlobalStyles />
      <GlobalStylesOverride />
      <HeliaProvider>
      <AppStateProvider>
        <NotificationProvider>
          <Header />
          <Main>
            {hasBreadcrumb && <AutoBreadcrumb names={breadcrumbNames} />}
            <Component {...pageProps} />
          </Main>
          <Footer small={true} />
        </NotificationProvider>
      </AppStateProvider>
      </HeliaProvider>
    </ThemeProvider>
  )
}
