import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Confidential, ConfidentialManager } from '@/domain/confidential'
import { useConfidentialManager } from '@/hooks/common/useManager/useConfidentialManager'
import { useRequestConfidentials } from '@/hooks/common/useRequestEntity/useRequestConfidentials'
import {
  useManageInstanceEntity,
  UseManageInstanceEntityReturn,
} from '@/hooks/common/useEntity/useManageInstanceEntity'
import { useForwardedPorts } from '@/hooks/common/useForwardedPorts'
import { getSSHForwardedPort } from '@/components/common/entityData/EntityPortForwarding/utils'
import { ForwardedPort } from '@/components/common/entityData/EntityPortForwarding/types'

export type UseManageGpuInstanceReturn = UseManageInstanceEntityReturn & {
  confidentialInstance?: Confidential
  confidentialInstanceManager?: ConfidentialManager
  ports: ForwardedPort[]
  sshForwardedPort?: string
  handlePortsChange: (ports: ForwardedPort[]) => void
}

export function useManageGpuInstance(): UseManageGpuInstanceReturn {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestConfidentials({ ids: hash as string })
  const [confidentialInstance] = entities || []

  const confidentialInstanceManager = useConfidentialManager()

  const manageInstanceEntityProps = useManageInstanceEntity<
    Confidential,
    ConfidentialManager
  >({
    entity: confidentialInstance,
    entityManager: confidentialInstanceManager,
  })

  const { status } = manageInstanceEntityProps

  // Fetch forwarded ports
  const { ports: fetchedPorts } = useForwardedPorts({
    entityHash: confidentialInstance?.id,
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

  return {
    confidentialInstance,
    confidentialInstanceManager,
    ports,
    sshForwardedPort,
    handlePortsChange,
    ...manageInstanceEntityProps,
  }
}
