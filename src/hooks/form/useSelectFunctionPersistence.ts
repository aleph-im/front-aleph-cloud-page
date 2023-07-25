import { ChangeEvent, useCallback, useMemo, useState } from 'react'

export type UseSelectFunctionPersistenceProps = {
  value?: boolean
  onChange: (isPersistent: boolean) => void
}

export type UseSelectFunctionPersistenceReturn = {
  isPersistent?: boolean
  value?: string
  handleChange: (_: ChangeEvent<HTMLInputElement>, value?: unknown) => void
}

export function useSelectFunctionPersistence({
  value: isPersistentProp,
  onChange,
}: UseSelectFunctionPersistenceProps): UseSelectFunctionPersistenceReturn {
  const [isPersistentState, setFunctionPersistenceState] = useState<
    boolean | undefined
  >()
  const isPersistent = isPersistentProp || isPersistentState

  const handleChange = useCallback(
    (_: ChangeEvent<HTMLInputElement>, value?: unknown) => {
      const isPersistent = value === 'true'
      setFunctionPersistenceState(isPersistent)
      onChange(isPersistent)
    },
    [onChange],
  )

  const value = useMemo(
    () => (isPersistent ? isPersistent + '' : undefined),
    [isPersistent],
  )

  return {
    value,
    isPersistent,
    handleChange,
  }
}
