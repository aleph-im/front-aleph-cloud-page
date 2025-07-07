import { useAppState } from '@/contexts/appState'
import { ConfigState, ConfigSwitchThemeAction } from '@/store/config'
import { useCallback } from 'react'

export function useConfig() {
  const [{ config }, dispatch] = useAppState()

  const switchTheme = useCallback(
    ({ theme }: { theme: ConfigState['theme'] }) => {
      dispatch(new ConfigSwitchThemeAction({ theme }))
    },
    [dispatch],
  )

  return {
    ...config,
    switchTheme,
  }
}
