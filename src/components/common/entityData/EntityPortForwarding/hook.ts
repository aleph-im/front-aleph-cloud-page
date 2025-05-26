import { useCallback, useState } from 'react'

export type UseEntityPortForwardingReturn = {
  showAddPort: boolean
  handleAddPort: () => void
  handleCancelAddPort: () => void
}

export function useEntityPortForwarding(): UseEntityPortForwardingReturn {
  const [showAddPort, setShowAddPort] = useState(false)
  const handleAddPort = useCallback(() => setShowAddPort(true), [])
  const handleCancelAddPort = useCallback(() => setShowAddPort(false), [])

  return {
    showAddPort,
    handleAddPort,
    handleCancelAddPort,
  }
}
