import { useCallback, useState, useEffect, useRef } from 'react'
import { ForwardedPort, NewForwardedPortEntry } from './types'
import { useForwardedPortsManager } from '@/hooks/common/useManager/useForwardedPortsManager'
import { PortProtocol } from '@/domain/forwardedPorts'
import { ExecutableStatus, ExecutableManager } from '@/domain/executable'
import { NodeManager } from '@/domain/node'

export type UseEntityPortForwardingProps = {
  entityHash?: string
  executableStatus?: ExecutableStatus
  executableManager?: ExecutableManager<any>
}

export type UseEntityPortForwardingReturn = {
  // State
  showPortForm: boolean
  ports: ForwardedPort[]

  // Actions
  handleAddPort: () => void
  handleCancelAddPort: () => void
  handleRemovePort: (source: string) => void
  handleSubmitNewPorts: (newPorts: NewForwardedPortEntry[]) => void
}

export const SYSTEM_PORTS: ForwardedPort[] = [
  {
    source: '22',
    destination: undefined,
    tcp: true,
    udp: true,
    isDeletable: false, // System ports cannot be deleted
  },
]

export function useEntityPortForwarding({
  entityHash,
  executableStatus,
  executableManager,
}: UseEntityPortForwardingProps = {}): UseEntityPortForwardingReturn {
  const [showPortForm, setShowPortForm] = useState(false)
  const [ports, setPorts] = useState<ForwardedPort[]>(SYSTEM_PORTS)
  const [isLoading, setIsLoading] = useState(false)

  const forwardedPortsManager = useForwardedPortsManager()

  // Function to notify CRN about port changes
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
        operation: 'update' as any,
        vmId: entityHash,
        requireSignature: false,
      })
    } catch (error) {
      console.error('Failed to notify CRN about port changes:', error)
    }
  }, [executableManager, entityHash, executableStatus?.node])

  // Load existing ports for the entity
  useEffect(() => {
    const loadPorts = async () => {
      if (!entityHash || !forwardedPortsManager) {
        setPorts(SYSTEM_PORTS)
        return
      }

      try {
        const existingPorts =
          await forwardedPortsManager.getByEntityHash(entityHash)

        const userPorts: ForwardedPort[] = existingPorts?.ports
          ? Object.entries(existingPorts.ports).map(([port, protocol]) => ({
              source: port,
              destination: undefined,
              tcp: protocol.tcp,
              udp: protocol.udp,
              isDeletable: true,
            }))
          : []

        setPorts([...SYSTEM_PORTS, ...userPorts])
      } catch (error) {
        console.error('Failed to load ports:', error)
        setPorts(SYSTEM_PORTS) // Fallback to system ports only
      }
    }

    loadPorts()
  }, [entityHash, forwardedPortsManager])

  // Load destination ports from executable status
  useEffect(() => {
    console.log('executableStatus', executableStatus)
    if (!executableStatus?.mappedPorts) return

    setPorts((currentPorts) => {
      return currentPorts.map((port) => {
        const mappedPort = executableStatus.mappedPorts?.[port.source]

        return {
          ...port,
          destination: mappedPort?.host.toString(),
        }
      })
    })
  }, [executableStatus])

  // Periodic polling to check for unmapped ports every 5 seconds
  const pollingIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    // Only start polling if we have the required data and there are unmapped ports
    if (!executableManager || !entityHash || !executableStatus?.node) return

    const checkForUnmappedPorts = async () => {
      try {
        // Check if there are any ports without destination
        const hasUnmappedPorts = ports.some((port) => !port.destination)
        if (!hasUnmappedPorts) return

        // Fetch current status to get updated mapped ports
        const nodeUrl = NodeManager.normalizeUrl(
          executableStatus.node.address || '',
        )
        if (!nodeUrl) return

        // Create a mock executable to use the checkStatus method
        const mockExecutable = {
          id: entityHash,
          payment: executableStatus.node,
        }

        const updatedStatus = await executableManager.checkStatus(
          mockExecutable as any,
        )

        if (updatedStatus?.mappedPorts) {
          setPorts((currentPorts) => {
            return currentPorts.map((port) => {
              const mappedPort = updatedStatus.mappedPorts?.[port.source]
              return {
                ...port,
                destination: mappedPort?.host.toString() || port.destination,
              }
            })
          })
        }
      } catch (error) {
        console.error('Failed to poll for unmapped ports:', error)
      }
    }

    // Start polling every 5 seconds
    pollingIntervalRef.current = setInterval(checkForUnmappedPorts, 5000)

    // Cleanup on unmount or dependency change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [executableManager, entityHash, executableStatus?.node, ports])

  const handleAddPort = useCallback(() => {
    setShowPortForm(true)
  }, [])

  const handleCancelAddPort = useCallback(() => {
    setShowPortForm(false)
  }, [])

  const handleRemovePort = useCallback(
    async (source: string) => {
      if (!entityHash || !forwardedPortsManager || isLoading) return

      // Prevent removal of system port 2222
      // Check source does not belong to any system port
      if (
        SYSTEM_PORTS.some((port) => port.source === source && !port.isDeletable)
      ) {
        console.warn(`Cannot remove system port ${source}`)
        return
      }

      setIsLoading(true)

      try {
        // Get current ports and remove the specified one
        const existingPorts =
          await forwardedPortsManager.getByEntityHash(entityHash)
        const currentPorts = existingPorts?.ports || {}

        // Create new ports object without the removed port
        const updatedPorts = { ...currentPorts }
        delete updatedPorts[parseInt(source, 10)]

        // Save updated ports
        if (Object.keys(updatedPorts).length > 0) {
          await forwardedPortsManager.add({
            entityHash,
            ports: updatedPorts,
          })
        } else {
          // If no ports left, delete the entire entry
          await forwardedPortsManager.del(entityHash)
        }

        // Update local state
        setPorts((prev) => prev.filter((port) => port.source !== source))

        // Notify CRN about the port change
        await notifyCRNUpdate()
      } catch (error) {
        console.error('Failed to remove port:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [entityHash, forwardedPortsManager, isLoading, notifyCRNUpdate],
  )

  const handleSubmitNewPorts = useCallback(
    async (newPorts: NewForwardedPortEntry[]) => {
      if (!entityHash || !forwardedPortsManager || isLoading) return

      // Filter out port 2222 if user tries to add it manually
      const filteredPorts = newPorts.filter((port) => port.port !== '2222')

      if (filteredPorts.length === 0) {
        console.warn('No valid ports to add (port 2222 is reserved)')
        setShowPortForm(false)
        return
      }

      setIsLoading(true)
      try {
        // Get existing ports
        const existingPorts =
          await forwardedPortsManager.getByEntityHash(entityHash)
        const currentPorts = existingPorts?.ports || {}

        // Convert new ports to the correct format
        const newPortsMap: Record<number, PortProtocol> = {}
        filteredPorts.forEach((port) => {
          const portNumber = parseInt(port.port, 10)
          newPortsMap[portNumber] = {
            tcp: port.tcp,
            udp: port.udp,
          }
        })

        // Merge with existing ports
        const updatedPorts = { ...currentPorts, ...newPortsMap }

        // Save to the ForwardedPortsManager
        await forwardedPortsManager.add({
          entityHash,
          ports: updatedPorts,
        })

        // Update local state
        const newFormattedPorts: ForwardedPort[] = filteredPorts.map(
          (port) => ({
            source: port.port,
            destination: port.port, // Assuming destination is the same as source for new ports
            tcp: port.tcp,
            udp: port.udp,
            isDeletable: true, // New ports are deletable
          }),
        )

        setPorts((prev) => [...prev, ...newFormattedPorts])
        setShowPortForm(false)

        // Notify CRN about the port change
        await notifyCRNUpdate()
      } catch (error) {
        console.error('Failed to save ports:', error)
        // @todo: Show error notification to user
      } finally {
        setIsLoading(false)
      }
    },
    [entityHash, forwardedPortsManager, isLoading, notifyCRNUpdate],
  )

  return {
    // State
    showPortForm,
    ports,

    // Actions
    handleAddPort,
    handleCancelAddPort,
    handleRemovePort,
    handleSubmitNewPorts,
  }
}
