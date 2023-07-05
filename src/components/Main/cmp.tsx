import { useConnect } from '@/hooks/useConnect'
import { useEffect } from 'react'
import { MainProps } from './types'

export const Main = ({ children }: MainProps) => {
  const { isConnected, connect } = useConnect()

  useEffect(() => {
    async function tryReconnect() {
      if (isConnected) return
      await connect()
    }

    tryReconnect()
  }, [connect, isConnected])

  return <main>{children}</main>
}

export default Main
