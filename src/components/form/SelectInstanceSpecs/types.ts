import { EntityType } from '@/helpers/constants'
import { InstanceSpecsProp } from '@/hooks/form/useSelectInstanceSpecs'

export type SelectInstanceSpecsProps = {
  type: EntityType.Instance | EntityType.Program
  specs?: InstanceSpecsProp
  options?: InstanceSpecsProp[]
  isPersistent?: boolean
  onChange: (specs: InstanceSpecsProp) => void
}

export type SpecsDetail = {
  specs: InstanceSpecsProp
  storage: string // in GB
  ram: string // in GB
  price: string // in ALEPH
}
