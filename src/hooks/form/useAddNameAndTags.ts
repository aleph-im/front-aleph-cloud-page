import { EntityType } from '@/helpers/constants'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'

export type NameAndTagsProp = {
  name?: string
  tags?: string[]
}

export const defaultNameAndTags: NameAndTagsProp = {}

export type UseNameAndTagsProps = NameAndTagsProp & {
  entityType: EntityType.Instance | EntityType.Program
  onChange: (state: NameAndTagsProp) => void
}

export type UseNameAndTagsReturn = NameAndTagsProp & {
  entityName: string
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleTagsChange: (tags: string[]) => void
}

export function useAddNameAndTags({
  onChange,
  entityType,
  ...nameAndTagsProp
}: UseNameAndTagsProps): UseNameAndTagsReturn {
  const [nameAndTagsState, setNameAndTagsState] = useState<NameAndTagsProp>()
  const nameAndTags = nameAndTagsProp || nameAndTagsState

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value
      const updatedNameAndTags: NameAndTagsProp = { ...nameAndTags, name }

      setNameAndTagsState(updatedNameAndTags)
      onChange(updatedNameAndTags)
    },
    [onChange, nameAndTags],
  )

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      const updatedNameAndTags: NameAndTagsProp = { ...nameAndTags }

      if (tags.length > 0) {
        updatedNameAndTags.tags = tags
      }

      setNameAndTagsState(updatedNameAndTags)
      onChange(updatedNameAndTags)
    },
    [onChange, nameAndTags],
  )

  const entityName = useMemo(
    () => (entityType === EntityType.Instance ? 'Instance' : 'Function'),
    [entityType],
  )

  return {
    ...nameAndTags,
    entityName,
    handleNameChange,
    handleTagsChange,
  }
}
