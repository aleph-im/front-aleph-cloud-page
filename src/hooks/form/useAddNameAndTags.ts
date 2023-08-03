import { EntityType, EntityTypeName } from '@/helpers/constants'
import { formValidationRules } from '@/helpers/errors'
import { useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type NameAndTagsField = {
  name: string
  tags: string[]
}

export const defaultNameAndTags: NameAndTagsField = {
  name: '',
  tags: [],
}

export type UseNameAndTagsProps = {
  name?: string
  control: Control
  defaultValue?: NameAndTagsField
  entityType: EntityType.Instance | EntityType.Program
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
  const { required } = formValidationRules

  const nameCtrl = useController({
    control,
    name: `${name}.name`,
    defaultValue: defaultValue?.name,
    rules: { required },
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
