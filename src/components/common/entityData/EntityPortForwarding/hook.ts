import { useCallback, useMemo, useState } from 'react'
import { ForwardedPort, NewForwardedPortEntry } from './types'

export type UseEntityPortForwardingReturn = {
  // State
  showAddPort: boolean
  ports: ForwardedPort[]
  newPorts: NewForwardedPortEntry[]

  // Actions
  handleAddPort: () => void
  handleCancelAddPort: () => void
  handleRemovePort: (source: string) => void
  handleRemoveNewPort: (id: string) => void
  handleUpdateNewPort: (
    id: string,
    field: keyof Omit<NewForwardedPortEntry, 'id'>,
    value: string | boolean,
  ) => void
  handleSaveNewPorts: () => void
  addNewEmptyPort: () => void

  // Validation
  isValidPort: (port: string) => boolean
  isValidPortEntry: (port: NewForwardedPortEntry) => boolean
  disabledSaveNewPorts: boolean
}

export function useEntityPortForwarding(): UseEntityPortForwardingReturn {
  const [showAddPort, setShowAddPort] = useState(false)
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
  const [newPorts, setNewPorts] = useState<NewForwardedPortEntry[]>([])

  const addNewEmptyPort = useCallback(() => {
    const newPort: NewForwardedPortEntry = {
      id: Date.now().toString(),
      port: '',
      udp: false,
      tcp: false,
    }
    setNewPorts((prev) => [...prev, newPort])
  }, [])

  const handleAddPort = useCallback(() => {
    setShowAddPort(true)
    addNewEmptyPort()
  }, [addNewEmptyPort])

  const handleCancelAddPort = useCallback(() => {
    setShowAddPort(false)
    setNewPorts([])
  }, [])

  const handleRemovePort = useCallback((source: string) => {
    setPorts((prev) => prev.filter((port) => port.source !== source))
  }, [])

  const handleRemoveNewPort = useCallback((id: string) => {
    setNewPorts((prev) => prev.filter((port) => port.id !== id))
  }, [])

  const handleUpdateNewPort = useCallback(
    (
      id: string,
      field: keyof Omit<NewForwardedPortEntry, 'id'>,
      value: string | boolean,
    ) => {
      setNewPorts((prev) =>
        prev.map((port) =>
          port.id === id ? { ...port, [field]: value } : port,
        ),
      )
    },
    [],
  )

  const isValidPort = useCallback((port: string) => {
    const portNum = parseInt(port, 10)
    return !isNaN(portNum) && portNum > 0 && portNum <= 65535
  }, [])

  const isValidPortEntry = useCallback(
    (port: NewForwardedPortEntry) => {
      return isValidPort(port.port) && (port.udp || port.tcp)
    },
    [isValidPort],
  )

  const disabledSaveNewPorts = useMemo(
    () => !newPorts.length || !newPorts.every(isValidPortEntry),
    [newPorts, isValidPortEntry],
  )

  const handleSaveNewPorts = useCallback(() => {
    if (disabledSaveNewPorts) return

    // @todo: Implement actual save logic here
    console.log('Saving ports:', newPorts)
    setShowAddPort(false)
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
    setNewPorts([])
  }, [newPorts, disabledSaveNewPorts])

  return {
    // State
    showAddPort,
    ports,
    newPorts,

    // Actions
    handleAddPort,
    handleCancelAddPort,
    handleRemovePort,
    handleRemoveNewPort,
    handleUpdateNewPort,
    handleSaveNewPorts,
    addNewEmptyPort,

    // Validation
    isValidPort,
    isValidPortEntry,
    disabledSaveNewPorts,
  }
}
