import { EntityType } from '@/helpers/constants'
import { Control } from 'react-hook-form'

export type AddNameAndTagsProps = {
  entityType: EntityType.Instance | EntityType.Program | EntityType.Indexer
  name?: string
  control: Control
}
