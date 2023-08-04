import { useCallback } from 'react'
import {
  Control,
  FieldArrayWithId,
  UseControllerReturn,
  useController,
  useFieldArray,
} from 'react-hook-form'

export type DomainField = {
  name: string
}

export const defaultValues: DomainField = {
  name: '',
}

export type UseDomainItemProps = {
  name?: string
  index: number
  control: Control
  defaultValue?: DomainField
  onRemove: (index?: number) => void
}

export type UseDomainItemReturn = {
  nameCtrl: UseControllerReturn<any, any>
  handleRemove: () => void
}

export function useDomainItem({
  name = 'domains',
  index,
  control,
  defaultValue,
  onRemove,
}: UseDomainItemProps): UseDomainItemReturn {
  const nameCtrl = useController({
    control,
    name: `${name}.${index}.name`,
    defaultValue: defaultValue?.name,
  })

  const handleRemove = useCallback(() => {
    onRemove(index)
  }, [index, onRemove])

  return {
    nameCtrl,
    handleRemove,
  }
}

// --------------------

export type UseDomainsProps = {
  name?: string
  control: Control
}

export type UseDomainsReturn = {
  name: string
  control: Control
  fields: FieldArrayWithId[]
  handleAdd: () => void
  handleRemove: (index?: number) => void
}

export function useAddDomains({
  name = 'domains',
  control,
}: UseDomainsProps): UseDomainsReturn {
  const domainsCtrl = useFieldArray({
    control,
    name,
  })

  const { fields, remove: handleRemove, append } = domainsCtrl

  const handleAdd = useCallback(() => {
    append({ ...defaultValues })
  }, [append])

  return {
    name,
    control,
    fields,
    handleAdd,
    handleRemove,
  }
}
