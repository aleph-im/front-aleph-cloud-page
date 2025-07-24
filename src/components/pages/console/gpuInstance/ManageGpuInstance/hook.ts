import { useRouter } from 'next/router'
import { GpuInstance, GpuInstanceManager } from '@/domain/gpuInstance'
import { useGpuInstanceManager } from '@/hooks/common/useManager/useGpuInstanceManager'
import { useRequestGpuInstances } from '@/hooks/common/useRequestEntity/useRequestGpuInstances'
import {
  useManageInstanceEntity,
  UseManageInstanceEntityReturn,
} from '@/hooks/common/useEntity/useManageInstanceEntity'

export type UseManageGpuInstanceReturn = UseManageInstanceEntityReturn & {
  gpuInstance?: GpuInstance
  gpuInstanceManager?: GpuInstanceManager
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

  return {
    gpuInstance,
    gpuInstanceManager,
    ...manageInstanceEntityProps,
  }
}
