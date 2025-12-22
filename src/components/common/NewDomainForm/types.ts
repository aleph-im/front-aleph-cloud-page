import { EntityDomainType } from '@/helpers/constants'

export type NewDomainFormProps = {
  entityId?: string
  entityType?: EntityDomainType
  onSuccess?: () => void
}
