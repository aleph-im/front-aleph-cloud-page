import { useCallback, useState, useEffect } from 'react'
import { ForwardedPort, NewForwardedPortEntry } from './types'
import { useForwardedPortsManager } from '@/hooks/common/useManager/useForwardedPortsManager'
import { PortProtocol } from '@/domain/forwardedPorts'

export type UseEntityPortForwardingProps = {
  entityHash?: string
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

export function useEntityPortForwarding({
  entityHash,
}: UseEntityPortForwardingProps = {}): UseEntityPortForwardingReturn {
  const [showPortForm, setShowPortForm] = useState(false)
  const [ports, setPorts] = useState<ForwardedPort[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const forwardedPortsManager = useForwardedPortsManager()

  // Load existing ports for the entity
  useEffect(() => {
    if (!entityHash || !forwardedPortsManager) return

    const loadPorts = async () => {
      try {
        const existingPorts =
          await forwardedPortsManager.getByEntityHash(entityHash)
        if (existingPorts?.ports) {
          const formattedPorts: ForwardedPort[] = Object.entries(
            existingPorts.ports,
          ).map(([port, protocol]) => ({
            source: port,
            destination: port, // For now, assume destination is same as source
            tcp: protocol.tcp,
            udp: protocol.udp,
            isDeletable: true,
          }))
          setPorts(formattedPorts)
        }
      } catch (error) {
        console.error('Failed to load ports:', error)
      }
    }

    loadPorts()
  }, [entityHash, forwardedPortsManager])

  const handleAddPort = useCallback(() => {
    setShowPortForm(true)
  }, [])

  const handleCancelAddPort = useCallback(() => {
    setShowPortForm(false)
  }, [])

  const handleRemovePort = useCallback(
    async (source: string) => {
      if (!entityHash || !forwardedPortsManager || isLoading) return

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
      } catch (error) {
        console.error('Failed to remove port:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [entityHash, forwardedPortsManager, isLoading],
  )

  const handleSubmitNewPorts = useCallback(
    async (newPorts: NewForwardedPortEntry[]) => {
      if (!entityHash || !forwardedPortsManager || isLoading) return

      setIsLoading(true)
      try {
        // Get existing ports
        const existingPorts =
          await forwardedPortsManager.getByEntityHash(entityHash)
        const currentPorts = existingPorts?.ports || {}

        // Convert new ports to the correct format
        const newPortsMap: Record<number, PortProtocol> = {}
        newPorts.forEach((port) => {
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
        const newFormattedPorts: ForwardedPort[] = newPorts.map((port) => ({
          source: port.port,
          destination: port.port, // Assuming destination is the same as source for new ports
          tcp: port.tcp,
          udp: port.udp,
          isDeletable: true, // New ports are deletable
        }))

        setPorts((prev) => [...prev, ...newFormattedPorts])
        setShowPortForm(false)
      } catch (error) {
        console.error('Failed to save ports:', error)
        // @todo: Show error notification to user
      } finally {
        setIsLoading(false)
      }
    },
    [entityHash, forwardedPortsManager, isLoading],
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
