import { useRouter } from 'next/router'
import { Instance, InstanceManager } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import {
  useManageInstanceEntity,
  UseManageInstanceEntityReturn,
} from '@/hooks/common/useEntity/useManageInstanceEntity'

export type UseManageInstanceReturn = UseManageInstanceEntityReturn & {
  instance?: Instance
  instanceManager?: InstanceManager
}

export function useManageInstance(): UseManageInstanceReturn {
  const router = useRouter()
  const { hash } = router.query

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

  return {
    instance,
    instanceManager,
    ...manageInstanceEntityProps,
  }
}
