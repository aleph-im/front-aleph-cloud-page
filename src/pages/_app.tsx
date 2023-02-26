import '../styles/font.css'

// @IMPORTANT: Read https://fontawesome.com/docs/web/use-with/react/use-with#next-js
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { themes, GlobalStyle } from '@aleph-front/aleph-core'
import Footer from '@/components/Footer'
import { GlobalStylesOverride } from '@/styles/global'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={themes.dark}>
        <GlobalStyle />
        <GlobalStylesOverride />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </>
  )
}
