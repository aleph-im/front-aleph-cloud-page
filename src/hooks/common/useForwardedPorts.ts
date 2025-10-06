import { useState, useEffect, useCallback } from 'react'
import { useForwardedPortsManager } from '@/hooks/common/useManager/useForwardedPortsManager'
import { useAppState } from '@/contexts/appState'
import { ExecutableStatus } from '@/domain/executable'
import {
  getSystemPorts,
  transformAPIPortsToUI,
  mergePortsWithMappings,
  mergePendingPortsWithAggregate,
  applyPendingRemovals,
} from '@/components/common/entityData/EntityPortForwarding/utils'
import { ForwardedPort } from '@/components/common/entityData/EntityPortForwarding/types'

export type UseForwardedPortsProps = {
  entityHash?: string
  executableStatus?: ExecutableStatus
}

export type UseForwardedPortsReturn = {
  ports: ForwardedPort[]
  isLoading: boolean
  error: string | null
  reloadPorts: () => Promise<void>
}

/**
 * Hook for fetching and managing forwarded ports for an entity
 * Extracts port fetching logic to be used at parent component level
 */
export function useForwardedPorts({
  entityHash,
  executableStatus,
}: UseForwardedPortsProps = {}): UseForwardedPortsReturn {
  const [appState] = useAppState()
  const { account } = appState.connection
  const accountAddress = account?.address

  const [ports, setPorts] = useState<ForwardedPort[]>(getSystemPorts())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const forwardedPortsManager = useForwardedPortsManager()

  // Load existing ports for the entity
  const loadPorts = useCallback(async () => {
    if (!entityHash || !accountAddress || !forwardedPortsManager) {
      setPorts(getSystemPorts())
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const existingPorts =
        await forwardedPortsManager.getByEntityHash(entityHash)

      const aggregatePorts = existingPorts?.ports || {}

      // Merge aggregate ports with cached pending additions
      const portsWithAdditions = mergePendingPortsWithAggregate(
        entityHash,
        accountAddress,
        aggregatePorts,
      )

      // Apply pending removals
      const finalPorts = applyPendingRemovals(
        entityHash,
        accountAddress,
        portsWithAdditions,
      )
      const userPorts: ForwardedPort[] = transformAPIPortsToUI(finalPorts)

      const allPorts = [...getSystemPorts(), ...userPorts]
      setPorts(allPorts)
      setError(null)
    } catch (err) {
      console.error('Failed to load ports:', err)
      setError('Failed to load ports')
      setPorts(getSystemPorts())
    } finally {
      setIsLoading(false)
    }
  }, [entityHash, accountAddress, forwardedPortsManager])

  // Load ports when dependencies change
  useEffect(() => {
    loadPorts()
  }, [loadPorts])

  // Update ports when executable status changes (mapped ports)
  useEffect(() => {
    if (executableStatus?.mappedPorts) {
      setPorts((currentPorts) =>
        mergePortsWithMappings(currentPorts, executableStatus.mappedPorts),
      )
    }
  }, [executableStatus?.mappedPorts])

  return {
    ports,
    isLoading,
    error,
    reloadPorts: loadPorts,
  }
}
