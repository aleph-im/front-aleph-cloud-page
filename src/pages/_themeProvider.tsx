import { useAppState } from '@/contexts/appState'
import { themes } from '@aleph-front/core'
import { memo } from 'react'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import { default as twentysixDarkTheme } from '@/styles/twentysix-dark'

export type ThemeProviderProps = {
  children: React.ReactNode
  theme?: keyof typeof themes
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const [state] = useAppState()

  const themeName = theme ?? state.config.theme

  const selectedTheme =
    themeName === 'twentysixDark' ? twentysixDarkTheme : themes[themeName]

  console.log('themeName', themeName)
  console.log('selectedTheme', selectedTheme)

  return (
    <StyledComponentsThemeProvider theme={selectedTheme}>
      {children}
    </StyledComponentsThemeProvider>
  )
}
ThemeProvider.displayName = 'ThemeProvider'

export default memo(ThemeProvider)
