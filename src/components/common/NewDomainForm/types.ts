import { Domain } from '@/domain/domain'
import { EntityDomainType } from '@/helpers/constants'

export type NewDomainFormProps = {
  entityId?: string
  entityType?: EntityDomainType
  onSuccess?: (accountDomain: Domain) => void
  centered?: boolean
}
