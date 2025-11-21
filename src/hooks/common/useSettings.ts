import { useCallback, useEffect, useState } from 'react'
import {
  getApiServer,
  getApiServerDisplay,
  normalizeApiServer,
} from '@/helpers/server'

export type UseSettingsReturn = {
  apiServer: string
  apiServerDisplay: string
  handleSetApiServer: (apiServer: string) => void
}

export function useSettings(): UseSettingsReturn {
  const [apiServer, setApiServer] = useState<string>(getApiServer())

  useEffect(() => {
    const handleStorageChange = () => {
      setApiServer(getApiServer())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleSetApiServer = useCallback((newApiServer: string) => {
    const normalized = normalizeApiServer(newApiServer)
    localStorage.setItem('apiServer', normalized)
    setApiServer(normalized)
    window.location.reload()
  }, [])

  return {
    apiServer,
    apiServerDisplay: getApiServerDisplay(apiServer),
    handleSetApiServer,
  }
}
