import { useMemo } from 'react'
import { useAppState } from '@/contexts/appState'
import { BlockchainId, blockchains } from '@/domain/connect/base'
import { TooltipProps } from '@aleph-front/core'
import { unsupportedNetworkDisabledMessage } from '@/components/pages/account/disabledMessages'

export type UseEthereumNetworkReturn = {
  isEthereumNetwork: boolean
  blockchainName: string
  getEthereumNetworkTooltip: () => TooltipProps['content']
}

/**
 * Hook that checks if the current network is Ethereum and provides utility functions
 * for handling Ethereum-only functionality.
 *
 * @returns Object containing:
 * - isEthereumNetwork: boolean indicating if the current network is Ethereum
 * - blockchainName: string with the current blockchain name
 * - getEthereumNetworkTooltip: function that returns tooltip content for non-Ethereum networks
 */
export function useEthereumNetwork(): UseEthereumNetworkReturn {
  const [state] = useAppState()
  const { blockchain } = state.connection

  const isEthereumNetwork = useMemo(() => {
    return blockchain === BlockchainId.ETH
  }, [blockchain])

  const blockchainName = useMemo(() => {
    return blockchain ? blockchains[blockchain]?.name : 'Current network'
  }, [blockchain])

  const getEthereumNetworkTooltip = useMemo(() => {
    return () =>
      !isEthereumNetwork
        ? unsupportedNetworkDisabledMessage(blockchainName)
        : undefined
  }, [isEthereumNetwork, blockchainName])

  return {
    isEthereumNetwork,
    blockchainName,
    getEthereumNetworkTooltip,
  }
}
