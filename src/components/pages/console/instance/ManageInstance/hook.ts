import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { Instance, InstanceManager } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import {
  useManageInstanceEntity,
  UseManageInstanceEntityReturn,
} from '@/hooks/common/useEntity/useManageInstanceEntity'
import { useForwardedPorts } from '@/hooks/common/useForwardedPorts'
import { getSSHForwardedPort } from '@/components/common/entityData/EntityPortForwarding/utils'
import { ForwardedPort } from '@/components/common/entityData/EntityPortForwarding/types'
import { useAppState } from '@/contexts/appState'

export type UseManageInstanceReturn = UseManageInstanceEntityReturn & {
  instance?: Instance
  instanceManager?: InstanceManager
  ports: ForwardedPort[]
  sshForwardedPort?: string
  handlePortsChange: (ports: ForwardedPort[]) => void
  creditBalance?: number
}

export function useManageInstance(): UseManageInstanceReturn {
  const router = useRouter()
  const { hash } = router.query

  const [state] = useAppState()
  const { creditBalance } = state.connection

  const { entities } = useRequestInstances({ ids: hash as string })
  const [instance] = entities || []

  const instanceManager = useInstanceManager()

  const manageInstanceEntityProps = useManageInstanceEntity<
    Instance,
    InstanceManager
  >({
    entity: instance,
    entityManager: instanceManager,
  })

  const { status } = manageInstanceEntityProps

  // Fetch forwarded ports
  const { ports: fetchedPorts } = useForwardedPorts({
    entityHash: instance?.id,
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
    instance,
    instanceManager,
    ports,
    sshForwardedPort,
    handlePortsChange,
    creditBalance,
    ...manageInstanceEntityProps,
  }
}
