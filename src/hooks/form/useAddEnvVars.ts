import { useCallback } from 'react'
import {
  Control,
  FieldArrayWithId,
  UseControllerReturn,
  useController,
  useFieldArray,
} from 'react-hook-form'

export type EnvVarField = {
  name: string
  value: string
}

export const defaultValues: EnvVarField = {
  name: '',
  value: '',
}

export type UseEnvVarItemProps = {
  name?: string
  index: number
  control: Control
  defaultValue?: EnvVarField
  onRemove: (index?: number) => void
}

export type UseEnvVarItemReturn = {
  nameCtrl: UseControllerReturn<any, any>
  valueCtrl: UseControllerReturn<any, any>
  handleRemove: () => void
}

export function useEnvVarItem({
  name = 'envVars',
  index,
  control,
  defaultValue,
  onRemove,
}: UseEnvVarItemProps): UseEnvVarItemReturn {
  const nameCtrl = useController({
    control,
    name: `${name}.${index}.name`,
    defaultValue: defaultValue?.name,
  })

  const valueCtrl = useController({
    control,
    name: `${name}.${index}.value`,
    defaultValue: defaultValue?.value,
  })

  const handleRemove = useCallback(() => {
    onRemove(index)
  }, [index, onRemove])

  return {
    nameCtrl,
    valueCtrl,
    handleRemove,
  }
}

// --------------------

export type UseEnvVarsProps = {
  name?: string
  control: Control
}

export type UseEnvVarsReturn = {
  name: string
  control: Control
  fields: FieldArrayWithId[]
  handleAdd: () => void
  handleRemove: (index?: number) => void
}

export function useAddEnvVars({
  name = 'envVars',
  control,
}: UseEnvVarsProps): UseEnvVarsReturn {
  const envVarsCtrl = useFieldArray({
    control,
    name,
    shouldUnregister: true,
  })

  const { fields, remove: handleRemove, append } = envVarsCtrl

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
