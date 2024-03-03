import React, { createContext, useContext, ReactNode } from 'react'
import {
  WalletConnectReturn,
  useWalletConnect,
} from '@/hooks/common/useWalletConnect'

export const WalletConnectContext = createContext<WalletConnectReturn | null>(null)

export const WalletConnectProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const walletConnect = useWalletConnect()
  return (
    <WalletConnectContext.Provider value={walletConnect}>
      {children}
    </WalletConnectContext.Provider>
  )
}