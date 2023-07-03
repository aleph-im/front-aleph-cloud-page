import { ChangeEvent, useCallback, useState } from 'react'

export type NameAndTags = {
  name?: string
  tags?: string[]
}

export const defaultNameAndTags: NameAndTags = {}

export type UseNameAndTagsProps = NameAndTags & {
  onChange: (state: NameAndTags) => void
}

export type UseNameAndTagsReturn = NameAndTags & {
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleTagsChange: (tags: string[]) => void
}

export function useAddNameAndTags({
  onChange,
  ...nameAndTagsProp
}: UseNameAndTagsProps): UseNameAndTagsReturn {
  const [nameAndTagsState, setNameAndTagsState] = useState<NameAndTags>()
  const nameAndTags = nameAndTagsProp || nameAndTagsState

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value
      const updatedNameAndTags: NameAndTags = { ...nameAndTags, name }

      setNameAndTagsState(updatedNameAndTags)
      onChange(updatedNameAndTags)
    },
    [onChange, nameAndTags],
  )

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      const updatedNameAndTags: NameAndTags = { ...nameAndTags }

      if (tags.length > 0) {
        updatedNameAndTags.tags = tags
      }

      setNameAndTagsState(updatedNameAndTags)
      onChange(updatedNameAndTags)
    },
    [onChange, nameAndTags],
  )

  return {
    ...nameAndTags,
    handleNameChange,
    handleTagsChange,
  }
}
