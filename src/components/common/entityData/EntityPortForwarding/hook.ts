import { useCallback, useState } from 'react'
import { ForwardedPort, NewForwardedPortEntry } from './types'

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

export function useEntityPortForwarding(): UseEntityPortForwardingReturn {
  const [showPortForm, setShowPortForm] = useState(false)
  const [ports, setPorts] = useState<ForwardedPort[]>([
    {
      source: '2222',
      destination: '28741',
      tcp: true,
      udp: true,
      isDeletable: false,
    },
    {
      source: '80',
      destination: '28743',
      tcp: true,
      udp: false,
      isDeletable: true,
    },
  ])

  const handleAddPort = useCallback(() => {
    setShowPortForm(true)
  }, [])

  const handleCancelAddPort = useCallback(() => {
    setShowPortForm(false)
  }, [])

  const handleRemovePort = useCallback((source: string) => {
    setPorts((prev) => prev.filter((port) => port.source !== source))
  }, [])

  const handleSubmitNewPorts = useCallback(
    (newPorts: NewForwardedPortEntry[]) => {
      // @todo: Implement actual save logic here using ForwardedPortsManager
      console.log('Saving ports:', newPorts)

      setPorts((prev) => [
        ...prev,
        ...newPorts.map((port) => ({
          source: port.port,
          destination: port.port, // Assuming destination is the same as source for new ports
          tcp: port.tcp,
          udp: port.udp,
          isDeletable: true, // New ports are deletable
        })),
      ])

      setShowPortForm(false)
    },
    [],
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
