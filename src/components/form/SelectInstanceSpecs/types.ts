import { InstanceSpecs } from '@/hooks/form/useSelectInstanceSpecs'

export type SelectInstanceSpecsProps = {
  specs?: InstanceSpecs
  options?: InstanceSpecs[]
  isPersistentVM?: boolean
  onChange: (specs: InstanceSpecs) => void
}

export type SpecsDetail = {
  specs: InstanceSpecs
  ram: string // in GB
  price: string // in ALEPH
}
