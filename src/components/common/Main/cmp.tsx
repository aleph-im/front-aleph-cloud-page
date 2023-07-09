import { useEffect } from 'react'
import { MainProps } from './types'
import { useConnect } from '@/hooks/common/useConnect'
import { useSessionStorage } from 'usehooks-ts'

export const Main = ({ children }: MainProps) => {
  const { isConnected, connect } = useConnect()
  const [keepAccountAlive] = useSessionStorage(
    'keepAccountAlive',
    false,
  )

  useEffect(() => {
    async function tryReconnect() {
      if (isConnected) return
      await connect()
    }

    if(keepAccountAlive)
      tryReconnect()
  }, [connect, isConnected])

  return <main>{children}</main>
}

export default Main
