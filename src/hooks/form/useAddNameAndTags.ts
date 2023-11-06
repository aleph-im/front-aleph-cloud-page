import { EntityType, EntityTypeName } from '@/helpers/constants'
import { useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type NameAndTagsField = {
  name: string
  tags?: string[]
}

export const defaultNameAndTags: NameAndTagsField = {
  name: '',
}

export type UseNameAndTagsProps = {
  name?: string
  control: Control
  defaultValue?: NameAndTagsField
  entityType: EntityType.Instance | EntityType.Program | EntityType.Indexer
}

export type UseNameAndTagsReturn = {
  entityName: string
  nameCtrl: UseControllerReturn<any, any>
  tagsCtrl: UseControllerReturn<any, any>
}

export function useAddNameAndTags({
  name = '',
  control,
  defaultValue,
  entityType,
}: UseNameAndTagsProps): UseNameAndTagsReturn {
  const nameCtrl = useController({
    control,
    name: `${name}.name`,
    defaultValue: defaultValue?.name,
  })

  const tagsCtrl = useController({
    control,
    name: `${name}.tags`,
    defaultValue: defaultValue?.tags,
  })

  const entityName = useMemo(() => EntityTypeName[entityType], [entityType])

  return {
    entityName,
    nameCtrl,
    tagsCtrl,
  }
}
