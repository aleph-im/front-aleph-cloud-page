import { InstanceSpecsProp } from '@/hooks/form/useSelectInstanceSpecs'

export type SelectInstanceSpecsProps = {
  value?: InstanceSpecsProp
  options?: InstanceSpecsProp[]
  isPersistent?: boolean
  onChange: (specs: InstanceSpecsProp) => void
}

export type SpecsDetail = {
  specs: InstanceSpecsProp
  ram: string // in GB
  price: string // in ALEPH
}
