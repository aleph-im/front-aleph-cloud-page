import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useConnect } from '../useConnect'
import { DefaultTheme, useTheme } from 'styled-components'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'

export type Header = {
  theme: DefaultTheme
  handleConnect: () => void
  account: Account | undefined
}

export function useHeader(): Header {
  const { connect, disconnect, isConnected, account } = useConnect()
  const theme = useTheme()
  const router = useRouter()

  // @note: wait till account is connected and redirect
  const handleConnect = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
      router.push('/solutions/dashboard')
    } else {
      await disconnect()
      router.push('/')
    }
  }, [connect, disconnect, isConnected, router])

  return {
    theme,
    handleConnect,
    account,
  }
}
