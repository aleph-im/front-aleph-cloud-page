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
import { breadcrumbNames } from '@/helpers/constants'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const hasBreadcrumb = router.pathname !== '/dashboard/manage'

  return (
    <ThemeProvider theme={themes.dark}>
      <GlobalStyles />
      <GlobalStylesOverride />
      <AppStateProvider>
        <NotificationProvider>
          <Header />
          <main>
            {hasBreadcrumb && <AutoBreadcrumb names={breadcrumbNames} />}
            <Component {...pageProps} />
          </main>
          <Footer small={true} />
        </NotificationProvider>
      </AppStateProvider>
    </ThemeProvider>
  )
}
