import { Control } from 'react-hook-form'
import { EntityType } from '@/helpers/constants'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { CRNSpecs } from '@/domain/node'
import { ReactNode } from 'react'
import { AggregatedNodeSpecs } from '@/hooks/common/useAggregatedNodeSpecs'

export type SelectInstanceSpecsProps = {
  name?: string
  control: Control
  options?: InstanceSpecsField[]
  type: EntityType.Instance | EntityType.GpuInstance | EntityType.Program
  gpuModel?: string
  isPersistent?: boolean
  nodeSpecs?: CRNSpecs
  aggregatedSpecs?: AggregatedNodeSpecs
  children?: ReactNode
  showOpenClawSpotlight?: boolean
}

export type SpecsDetail = {
  specs: InstanceSpecsField
  storage: string // in GiB
  ram: string // in GiB
  price: number
  isActive: boolean
}
