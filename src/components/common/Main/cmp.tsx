import { useEffect } from 'react'
import { MainProps } from './types'
import { useConnect } from '@/hooks/common/useConnect'

export const Main = ({ children }: MainProps) => {
  const { tryReconnect } = useConnect()

  useEffect(() => {
    tryReconnect()
  }, [tryReconnect])

  return <main>{children}</main>
}

export default Main
