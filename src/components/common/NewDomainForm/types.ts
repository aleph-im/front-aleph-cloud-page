import { Domain } from '@/domain/domain'
import { EntityDomainType } from '@/helpers/constants'

export type NewDomainFormProps = {
  name?: string
  entityId?: string
  entityType?: EntityDomainType
  onSuccess?: (accountDomain: Domain) => void
  variant?: 'standalone' | 'embedded'
  showResourceSelection?: boolean
}
