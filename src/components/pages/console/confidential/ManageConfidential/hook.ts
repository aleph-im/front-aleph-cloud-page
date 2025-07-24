import { useRouter } from 'next/router'
import { Confidential, ConfidentialManager } from '@/domain/confidential'
import { useConfidentialManager } from '@/hooks/common/useManager/useConfidentialManager'
import { useRequestConfidentials } from '@/hooks/common/useRequestEntity/useRequestConfidentials'
import {
  useManageInstanceEntity,
  UseManageInstanceEntityReturn,
} from '@/hooks/common/useEntity/useManageInstanceEntity'

export type UseManageGpuInstanceReturn = UseManageInstanceEntityReturn & {
  confidentialInstance?: Confidential
  confidentialInstanceManager?: ConfidentialManager
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

  return {
    confidentialInstance,
    confidentialInstanceManager,
    ...manageInstanceEntityProps,
  }
}
