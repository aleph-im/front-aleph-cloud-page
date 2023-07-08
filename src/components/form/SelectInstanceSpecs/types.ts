import { InstanceSpecsProp } from '@/hooks/form/useSelectInstanceSpecs'

export type SelectInstanceSpecsProps = {
  specs?: InstanceSpecsProp
  options?: InstanceSpecsProp[]
  isPersistentVM?: boolean
  onChange: (specs: InstanceSpecsProp) => void
}

export type SpecsDetail = {
  specs: InstanceSpecsProp
  ram: string // in GB
  price: string // in ALEPH
}
