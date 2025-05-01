import { useAppState } from '@/contexts/appState'
import { themes } from '@aleph-front/core'
import { memo } from 'react'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

export type ThemeProviderProps = {
  children: React.ReactNode
  theme?: keyof typeof themes
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const [state] = useAppState()

  const themeName = theme ?? state.config.theme

  return (
    <StyledComponentsThemeProvider theme={themes[themeName]}>
      {children}
    </StyledComponentsThemeProvider>
  )
}
ThemeProvider.displayName = 'ThemeProvider'

export default memo(ThemeProvider)
