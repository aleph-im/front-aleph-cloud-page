import { Instance } from '@/domain/instance'
import { ExecutableStatus } from '@/domain/executable'
import { RequestState } from '@aleph-front/core'

export type InstancesTabContentProps = {
  data: Instance[]
}

export type InstancesTabContentInternalProps = {
  data: Instance[]
  statusMap: Record<string, RequestState<ExecutableStatus>>
  statusLoading: boolean
  onManage: (instance: Instance) => void
  onDelete: (instance: Instance) => void
}
