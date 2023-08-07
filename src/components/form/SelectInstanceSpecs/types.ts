import { Control } from 'react-hook-form'
import { EntityType } from '@/helpers/constants'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'

export type SelectInstanceSpecsProps = {
  name?: string
  control: Control
  options?: InstanceSpecsField[]
  type: EntityType.Instance | EntityType.Program
  isPersistent?: boolean
}

export type SpecsDetail = {
  specs: InstanceSpecsField
  storage: string // in GB
  ram: string // in GB
  price: string // in ALEPH
  isActive: boolean
  className: string
}
