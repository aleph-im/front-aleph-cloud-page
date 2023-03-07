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
import Header from '@/components/Header'

import { createContext, useReducer, Dispatch } from 'react'
import { initialState, reducer, State } from '@/helpers/store'

export const AppStateContext = createContext<{state: State, dispatch: Dispatch<any>}>({state: initialState, dispatch: () => null})

export default function App({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      <ThemeProvider theme={themes.dark}>
        <GlobalStyle />
        <GlobalStylesOverride />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </AppStateContext.Provider>
  )
}
