import { EntityType } from '@/helpers/constants'
import { NameAndTagsProp } from '@/hooks/form/useAddNameAndTags'

export type AddNameAndTagsProps = NameAndTagsProp & {
  entityType: EntityType.Instance | EntityType.Program
  onChange: (state: NameAndTagsProp) => void
}
