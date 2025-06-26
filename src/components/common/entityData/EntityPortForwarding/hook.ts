import { useCallback, useState, useEffect, useRef } from 'react'
import { NewForwardedPortEntry, ForwardedPort } from './types'
import { ExecutableStatus, ExecutableManager } from '@/domain/executable'
import { NodeManager } from '@/domain/node'
import { useForwardedPortsManager } from '@/hooks/common/useManager/useForwardedPortsManager'
import { useAppState } from '@/contexts/appState'
import {
  getSystemPorts,
  transformAPIPortsToUI,
  mergePortsWithMappings,
  filterOutSystemPorts,
  validatePortBatch,
  isSystemPort,
  NOTIFICATION_DELAY,
  POLLING_INTERVAL,
  hasUnmappedPorts,
  addPendingPorts,
  transformPortsToAPIFormat,
  mergePendingPortsWithAggregate,
  addPendingPortRemoval,
  applyPendingRemovals,
  getPendingRemovalsForEntity,
} from './utils'

export type UseEntityPortForwardingProps = {
  entityHash?: string
  executableStatus?: ExecutableStatus
  executableManager?: ExecutableManager<any>
}

export type UseEntityPortForwardingReturn = {
  // State
  showPortForm: boolean
  ports: ForwardedPort[]
  isLoading: boolean
  error: string | null

  // Actions
  handleAddPort: () => void
  handleCancelAddPort: () => void
  handleRemovePort: (source: string) => void
  handleSubmitNewPorts: (newPorts: NewForwardedPortEntry[]) => void
}

// CRN Notification functions
function useCRNNotification(
  entityHash?: string,
  executableStatus?: ExecutableStatus,
  executableManager?: ExecutableManager<any>,
) {
  const notificationTimeoutRef = useRef<NodeJS.Timeout>()

  const notifyCRNUpdate = useCallback(async () => {
    if (!executableManager || !entityHash || !executableStatus?.node) return

    try {
      const nodeUrl = NodeManager.normalizeUrl(
        executableStatus.node.address || '',
      )
      if (!nodeUrl) return

      await executableManager.sendPostOperation({
        hostname: nodeUrl,
        operation: 'update',
        vmId: entityHash,
        requireSignature: false,
      })
    } catch (error) {
      console.error('Failed to notify CRN about port changes:', error)
    }
  }, [executableManager, entityHash, executableStatus?.node])

  const scheduleNotifyCRNUpdate = useCallback(() => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }

    notificationTimeoutRef.current = setTimeout(() => {
      notifyCRNUpdate()
    }, NOTIFICATION_DELAY)
  }, [notifyCRNUpdate])

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  return { notifyCRNUpdate, scheduleNotifyCRNUpdate }
}

// Port operations functions
function usePortForwardingOperations(
  entityHash?: string,
  accountAddress?: string,
  isLoading?: boolean,
  onSuccess?: () => void,
  onError?: (error: string) => void,
  onLoadingChange?: (loading: boolean) => void,
  onPortsAdd?: (ports: ForwardedPort[]) => void,
  onPortRemove?: (portSource: string) => void,
  onPortRemovalStateChange?: (portSource: string, isRemoving: boolean) => void,
) {
  const forwardedPortsManager = useForwardedPortsManager()

  const addPorts = useCallback(
    async (newPorts: NewForwardedPortEntry[]) => {
      if (!entityHash || !accountAddress || !forwardedPortsManager || isLoading)
        return

      const filteredPorts = filterOutSystemPorts(newPorts)

      if (filteredPorts.length === 0) {
        onError?.('No valid ports to add (system ports are reserved)')
        return
      }

      // Get existing ports count (excluding system ports like SSH)
      const existingPorts =
        await forwardedPortsManager.getByEntityHash(entityHash)
      const currentPortsCount = existingPorts?.ports
        ? Object.keys(existingPorts.ports).length
        : 0

      const validation = validatePortBatch(filteredPorts, currentPortsCount)
      if (!validation.isValid) {
        onError?.(validation.errors.join(', '))
        return
      }

      const conflicts = await forwardedPortsManager.validatePortConflicts(
        entityHash,
        filteredPorts,
      )

      // Filter out conflicts that are actually pending removal
      const pendingRemovals = getPendingRemovalsForEntity(
        entityHash,
        accountAddress,
      )
      const actualConflicts = conflicts.conflicts.filter((portStr) => {
        const portNumber = parseInt(portStr, 10)
        return !pendingRemovals.includes(portNumber)
      })

      if (actualConflicts.length > 0) {
        onError?.(`Ports already exist: ${actualConflicts.join(', ')}`)
        return
      }

      onLoadingChange?.(true)
      try {
        // Wait for user to sign the message before updating UI
        await forwardedPortsManager.addMultiplePorts(entityHash, filteredPorts)

        // Only after successful signing, add to cache and update UI
        const newPortsForCache = transformPortsToAPIFormat(filteredPorts)
        addPendingPorts(entityHash, accountAddress, newPortsForCache)

        const newFormattedPorts: ForwardedPort[] = filteredPorts.map(
          (port) => ({
            source: port.port,
            destination: undefined,
            tcp: port.tcp,
            udp: port.udp,
            isDeletable: true,
          }),
        )

        onPortsAdd?.(newFormattedPorts)
        onSuccess?.()
      } catch (error) {
        console.error('Failed to add ports:', error)
        onError?.('Failed to add ports')
      } finally {
        onLoadingChange?.(false)
      }
    },
    [
      entityHash,
      accountAddress,
      forwardedPortsManager,
      isLoading,
      onSuccess,
      onError,
      onLoadingChange,
      onPortsAdd,
    ],
  )

  const removePort = useCallback(
    async (portSource: string) => {
      if (!entityHash || !accountAddress || !forwardedPortsManager || isLoading)
        return

      if (isSystemPort(portSource)) {
        onError?.(`Cannot remove system port ${portSource}`)
        return
      }

      // Set port as removing to show loading state
      onPortRemovalStateChange?.(portSource, true)

      try {
        // Wait for user to sign the message before removing from UI
        await forwardedPortsManager.removePort(entityHash, portSource)

        // Only after successful signing, add to pending removals cache and update UI
        addPendingPortRemoval(
          entityHash,
          accountAddress,
          parseInt(portSource, 10),
        )
        onPortRemove?.(portSource)
        onSuccess?.()
      } catch (error) {
        console.error('Failed to remove port:', error)
        onError?.('Failed to remove port')
      } finally {
        // Clear the removing state
        onPortRemovalStateChange?.(portSource, false)
      }
    },
    [
      entityHash,
      accountAddress,
      forwardedPortsManager,
      isLoading,
      onSuccess,
      onError,
      onPortRemove,
      onPortRemovalStateChange,
    ],
  )

  return { addPorts, removePort }
}

// Port polling logic
function usePortPolling(
  entityHash?: string,
  executableStatus?: ExecutableStatus,
  executableManager?: ExecutableManager<any>,
  ports?: ForwardedPort[],
  notifyCRNUpdate?: () => Promise<void>,
  onPortsUpdate?: (
    updater: (currentPorts: ForwardedPort[]) => ForwardedPort[],
  ) => void,
) {
  const pollingIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    if (!executableManager || !entityHash || !executableStatus?.node) return

    const checkForUnmappedPorts = async () => {
      try {
        if (!ports || !hasUnmappedPorts(ports)) return

        await notifyCRNUpdate?.()

        const nodeUrl = NodeManager.normalizeUrl(
          executableStatus.node.address || '',
        )
        if (!nodeUrl) return

        const mockExecutable = {
          id: entityHash,
          payment: executableStatus.node,
        }

        const updatedStatus = await executableManager.checkStatus(
          mockExecutable as any,
        )

        if (updatedStatus?.mappedPorts) {
          onPortsUpdate?.((currentPorts) => {
            return currentPorts.map((port) => {
              const mappedPort = updatedStatus.mappedPorts?.[port.source]
              return {
                ...port,
                destination: mappedPort?.host.toString(),
              }
            })
          })
        }
      } catch (error) {
        console.error('Failed to poll for unmapped ports:', error)
      }
    }

    pollingIntervalRef.current = setInterval(
      checkForUnmappedPorts,
      POLLING_INTERVAL,
    )

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [
    executableManager,
    entityHash,
    executableStatus?.node,
    ports,
    notifyCRNUpdate,
    onPortsUpdate,
  ])
}

// Main hook implementation
export function useEntityPortForwarding({
  entityHash,
  executableStatus,
  executableManager,
}: UseEntityPortForwardingProps = {}): UseEntityPortForwardingReturn {
  // Get account address from app state
  const [appState] = useAppState()
  const { account } = appState.connection
  const accountAddress = account?.address

  // State
  const [ports, setPorts] = useState<ForwardedPort[]>(getSystemPorts())
  const [showPortForm, setShowPortForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const forwardedPortsManager = useForwardedPortsManager()

  // Load existing ports for the entity
  const loadPorts = useCallback(async () => {
    if (!entityHash || !accountAddress || !forwardedPortsManager) {
      setPorts(getSystemPorts())
      return
    }

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
    } catch (error) {
      console.error('Failed to load ports:', error)
      setError('Failed to load ports')
      setPorts(getSystemPorts())
    }
  }, [entityHash, accountAddress, forwardedPortsManager])

  // Load ports when entityHash changes
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

  // State management helpers
  const addPortsToState = useCallback((newPorts: ForwardedPort[]) => {
    setPorts((prev) => [...prev, ...newPorts])
    setShowPortForm(false)
    setError(null)
  }, [])

  const removePortFromState = useCallback((portSource: string) => {
    setPorts((prev) => prev.filter((port) => port.source !== portSource))
    setError(null)
  }, [])

  const setPortRemovalState = useCallback(
    (portSource: string, isRemoving: boolean) => {
      setPorts((prev) =>
        prev.map((port) =>
          port.source === portSource ? { ...port, isRemoving } : port,
        ),
      )
    },
    [],
  )

  const updatePorts = useCallback(
    (updater: (currentPorts: ForwardedPort[]) => ForwardedPort[]) => {
      setPorts(updater)
    },
    [],
  )

  const toggleForm = useCallback((show?: boolean) => {
    setShowPortForm(show !== undefined ? show : (prev) => !prev)
  }, [])

  // CRN notification logic
  const { notifyCRNUpdate, scheduleNotifyCRNUpdate } = useCRNNotification(
    entityHash,
    executableStatus,
    executableManager,
  )

  // Port operations logic
  const { addPorts, removePort } = usePortForwardingOperations(
    entityHash,
    accountAddress,
    isLoading,
    scheduleNotifyCRNUpdate,
    setError,
    setIsLoading,
    addPortsToState,
    removePortFromState,
    setPortRemovalState,
  )

  // Port polling logic
  usePortPolling(
    entityHash,
    executableStatus,
    executableManager,
    ports,
    notifyCRNUpdate,
    updatePorts,
  )

  // UI handlers
  const handleAddPort = useCallback(() => {
    toggleForm(true)
  }, [toggleForm])

  const handleCancelAddPort = useCallback(() => {
    toggleForm(false)
    setError(null)
  }, [toggleForm])

  const handleRemovePort = useCallback(
    async (source: string) => {
      await removePort(source)
    },
    [removePort],
  )

  const handleSubmitNewPorts = useCallback(
    async (newPorts: NewForwardedPortEntry[]) => {
      await addPorts(newPorts)
      if (!error) {
        toggleForm(false)
      }
    },
    [addPorts, error, toggleForm],
  )

  return {
    // State
    showPortForm,
    ports,
    isLoading,
    error,

    // Actions
    handleAddPort,
    handleCancelAddPort,
    handleRemovePort,
    handleSubmitNewPorts,
  }
}
