import { useCallback, useState, useEffect, useRef } from 'react'
import { NewForwardedPortEntry, ForwardedPort } from './types'
import { ExecutableStatus, ExecutableManager } from '@/domain/executable'
import { NodeManager } from '@/domain/node'
import { useForwardedPortsManager } from '@/hooks/common/useManager/useForwardedPortsManager'
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
  removePendingPorts,
  transformPortsToAPIFormat,
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
        hostname: 'https://ovh.staging.aleph.sh',
        // hostname: nodeUrl,
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
      if (!entityHash || !forwardedPortsManager || isLoading) return

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
      if (conflicts.hasConflicts) {
        onError?.(`Ports already exist: ${conflicts.conflicts.join(', ')}`)
        return
      }

      onLoadingChange?.(true)
      try {
        // Add to cache immediately for instant UI feedback
        const newPortsForCache = transformPortsToAPIFormat(filteredPorts)
        addPendingPorts(entityHash, newPortsForCache)

        const newFormattedPorts: ForwardedPort[] = filteredPorts.map(
          (port) => ({
            source: port.port,
            destination: undefined,
            tcp: port.tcp,
            udp: port.udp,
            isDeletable: true,
          }),
        )

        // Update UI immediately
        onPortsAdd?.(newFormattedPorts)
        onSuccess?.()

        // Save to aggregate in background
        await forwardedPortsManager.addMultiplePorts(entityHash, filteredPorts)
      } catch (error) {
        console.error('Failed to save ports:', error)
        // If aggregate save fails, keep cached ports for later retry
        onError?.('Failed to save ports')
      } finally {
        onLoadingChange?.(false)
      }
    },
    [
      entityHash,
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
      if (!entityHash || !forwardedPortsManager || isLoading) return

      if (isSystemPort(portSource)) {
        onError?.(`Cannot remove system port ${portSource}`)
        return
      }

      // Set port as removing to show loading state
      onPortRemovalStateChange?.(portSource, true)

      try {
        // Wait for user to sign the message before removing from UI
        await forwardedPortsManager.removePort(entityHash, portSource)

        // Only after successful signing, remove from cache and UI
        removePendingPorts(entityHash, [parseInt(portSource, 10)])
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
  // State
  const [ports, setPorts] = useState<ForwardedPort[]>(getSystemPorts())
  const [showPortForm, setShowPortForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const forwardedPortsManager = useForwardedPortsManager()

  // Load existing ports for the entity
  const loadPorts = useCallback(async () => {
    if (!entityHash || !forwardedPortsManager) {
      setPorts(getSystemPorts())
      return
    }

    try {
      const existingPorts =
        await forwardedPortsManager.getByEntityHash(entityHash)

      const userPorts: ForwardedPort[] = existingPorts?.ports
        ? transformAPIPortsToUI(existingPorts.ports)
        : []

      const allPorts = [...getSystemPorts(), ...userPorts]
      setPorts(allPorts)
      setError(null)
    } catch (error) {
      console.error('Failed to load ports:', error)
      setError('Failed to load ports')
      setPorts(getSystemPorts())
    }
  }, [entityHash, forwardedPortsManager])

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
