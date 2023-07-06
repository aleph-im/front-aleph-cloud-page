import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { useConnect } from '../common/useConnect'

export type Header = {
  theme: DefaultTheme
  handleConnect: () => void
  account: Account | undefined
  isOnPath: (path: string) => boolean
}

export function useHeader(): Header {
  const { connect, disconnect, isConnected, account } = useConnect()
  const theme = useTheme()
  const router = useRouter()

  const isOnPath = (path: string) => router.pathname === path

  // @note: wait till account is connected and redirect
  const handleConnect = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
      router.push('/dashboard')
    } else {
      await disconnect()
      router.push('/')
    }
  }, [connect, disconnect, isConnected, router])

  return {
    theme,
    handleConnect,
    account,
    isOnPath,
  }
}
