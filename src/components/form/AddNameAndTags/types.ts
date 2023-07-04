import { EntityType } from '@/helpers/constants'
import { NameAndTags } from '@/hooks/form/useAddNameAndTags'

export type AddNameAndTagsProps = NameAndTags & {
  entityType: EntityType.Instance | EntityType.Program
  onChange: (state: NameAndTags) => void
}
