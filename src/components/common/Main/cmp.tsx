import { useEffect } from 'react'
import { MainProps } from './types'
import { useConnect } from '@/hooks/common/useConnect'
import { StyledMain } from './styles'

export const Main = ({ children }: MainProps) => {
  const { tryReconnect } = useConnect()

  // useEffect(() => {
  //   tryReconnect()
  // }, [tryReconnect])

  return <StyledMain>{children}</StyledMain>
}

export default Main
