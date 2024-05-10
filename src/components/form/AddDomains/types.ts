import { EntityDomainType } from '@/helpers/constants'
import { Control } from 'react-hook-form'

export type DomainItemProps = {
  name?: string
  index: number
  control: Control
  onRemove: (index?: number) => void
}

export type AddDomainsProps = {
  control: Control
  name: string
  entityType: EntityDomainType
}
