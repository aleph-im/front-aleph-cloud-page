import { Confidential } from '@/domain/confidential'
import { GpuInstance } from '@/domain/gpuInstance'
import { Instance } from '@/domain/instance'

export type InstanceDetailsProps = {
  entity?: Instance | GpuInstance | Confidential
  title?: string
}
