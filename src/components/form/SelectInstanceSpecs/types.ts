import { Control } from 'react-hook-form'
import { EntityType, PaymentMethod } from '@/helpers/constants'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { CRNSpecs } from '@/domain/node'

export type SelectInstanceSpecsProps = {
  name?: string
  control: Control
  options?: InstanceSpecsField[]
  type: EntityType.Instance | EntityType.Program
  isPersistent?: boolean
  paymentMethod?: PaymentMethod
  nodeSpecs?: CRNSpecs
}

export type SpecsDetail = {
  specs: InstanceSpecsField
  storage: string // in GiB
  ram: string // in GiB
  price: number
  isActive: boolean
}
