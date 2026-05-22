import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { GpuInstance, GpuInstanceManager } from '@/domain/gpuInstance'
import { useGpuInstanceManager } from '@/hooks/common/useManager/useGpuInstanceManager'
import { useRequestGpuInstances } from '@/hooks/common/useRequestEntity/useRequestGpuInstances'
import {
  useManageInstanceEntity,
  UseManageInstanceEntityReturn,
} from '@/hooks/common/useEntity/useManageInstanceEntity'
import { useForwardedPorts } from '@/hooks/common/useForwardedPorts'
import { getSSHForwardedPort } from '@/components/common/entityData/EntityPortForwarding/utils'
import { ForwardedPort } from '@/components/common/entityData/EntityPortForwarding/types'

export type UseManageGpuInstanceReturn = UseManageInstanceEntityReturn & {
  gpuInstance?: GpuInstance
  gpuInstanceManager?: GpuInstanceManager
  ports: ForwardedPort[]
  sshForwardedPort?: string
  handlePortsChange: (ports: ForwardedPort[]) => void
  isReinstallModalOpen: boolean
  handleOpenReinstallModal: () => void
  handleCloseReinstallModal: () => void
  handleConfirmReinstall: () => void
}

export function useManageGpuInstance(): UseManageGpuInstanceReturn {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestGpuInstances({ ids: hash as string })
  const [gpuInstance] = entities || []

  const gpuInstanceManager = useGpuInstanceManager()

  const manageInstanceEntityProps = useManageInstanceEntity<
    GpuInstance,
    GpuInstanceManager
  >({
    entity: gpuInstance,
    entityManager: gpuInstanceManager,
  })

  const { status } = manageInstanceEntityProps

  // Fetch forwarded ports
  const { ports: fetchedPorts } = useForwardedPorts({
    entityHash: gpuInstance?.id,
    executableStatus: status,
  })

  // Local state for ports to allow updates
  const [ports, setPorts] = useState<ForwardedPort[]>(fetchedPorts)

  // Update local ports state when fetched ports change
  useMemo(() => {
    setPorts(fetchedPorts)
  }, [fetchedPorts])

  // Extract SSH forwarded port
  const sshForwardedPort = useMemo(() => {
    return getSSHForwardedPort(ports)
  }, [ports])

  // Handler to update ports
  const handlePortsChange = (updatedPorts: ForwardedPort[]) => {
    setPorts(updatedPorts)
  }

  // Reinstall confirmation modal
  const { handleReinstall } = manageInstanceEntityProps

  const [isReinstallModalOpen, setIsReinstallModalOpen] = useState(false)

  const handleOpenReinstallModal = () => setIsReinstallModalOpen(true)
  const handleCloseReinstallModal = () => setIsReinstallModalOpen(false)
  const handleConfirmReinstall = () => {
    setIsReinstallModalOpen(false)
    handleReinstall()
  }

  return {
    gpuInstance,
    gpuInstanceManager,
    ports,
    sshForwardedPort,
    handlePortsChange,
    isReinstallModalOpen,
    handleOpenReinstallModal,
    handleCloseReinstallModal,
    handleConfirmReinstall,
    ...manageInstanceEntityProps,
  }
}
