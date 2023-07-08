import { useEffect } from 'react'
import { MainProps } from './types'
import { useConnect } from '@/hooks/common/useConnect'

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
