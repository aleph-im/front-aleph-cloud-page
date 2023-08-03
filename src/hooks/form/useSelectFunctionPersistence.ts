import { formValidationRules } from '@/helpers/errors'
import { ChangeEvent, useCallback, useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type FunctionPersistenceField = boolean

export type UseSelectFunctionPersistenceProps = {
  name?: string
  control: Control
  defaultValue?: FunctionPersistenceField
}

export type UseSelectFunctionPersistenceReturn = {
  isPersistentCtrl: UseControllerReturn<any, any>
  isPersistentValue: string
  isPersistentHandleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function useSelectFunctionPersistence({
  name = 'isPersistent',
  control,
  defaultValue,
}: UseSelectFunctionPersistenceProps): UseSelectFunctionPersistenceReturn {
  const { requiredBoolean } = formValidationRules

  const isPersistentCtrl = useController({
    control,
    name,
    defaultValue,
    rules: {
      validate: { requiredBoolean },
    },
  })

  const isPersistentHandleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value === 'true'
      isPersistentCtrl.field.onChange(val)
    },
    [isPersistentCtrl.field],
  )
  const isPersistentValue = useMemo(
    () => isPersistentCtrl.field.value + '',
    [isPersistentCtrl.field],
  )

  return {
    isPersistentCtrl,
    isPersistentValue,
    isPersistentHandleChange,
  }
}
