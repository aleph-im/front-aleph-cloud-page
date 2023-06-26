import { ChangeEvent, useCallback, useId, useState } from 'react'

export type EnvVar = {
  id: string
  name: string
  value: string
}

export const defaultEnvVar: EnvVar = {
  id: `envvar-0`,
  name: '',
  value: '',
}

export type UseEnvVarItemProps = {
  envVar: EnvVar
  onChange: (envVars: EnvVar) => void
  onRemove: (envVarId: string) => void
}

export type UseEnvVarItemReturn = {
  id: string
  envVar: EnvVar
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleValueChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemove: () => void
}

export function useEnvVarItem({
  envVar,
  onChange,
  onRemove,
}: UseEnvVarItemProps): UseEnvVarItemReturn {
  const id = useId()

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value
      const newEnvVar: EnvVar = { ...envVar, name }
      onChange(newEnvVar)
    },
    [onChange, envVar],
  )

  const handleValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const newEnvVar: EnvVar = { ...envVar, value }
      onChange(newEnvVar)
    },
    [onChange, envVar],
  )

  const handleRemove = useCallback(() => {
    onRemove(envVar.id)
  }, [envVar.id, onRemove])

  return {
    id,
    envVar,
    handleNameChange,
    handleValueChange,
    handleRemove,
  }
}

// --------------------

export type UseEnvVarsProps = {
  envVars?: EnvVar[]
  onChange: (envVars: EnvVar[]) => void
}

export type UseEnvVarsReturn = {
  envVars: EnvVar[]
  handleChange: (envVars: EnvVar) => void
  handleAdd: () => void
  handleRemove: (envVarId: string) => void
}

export function useAddEnvVars({
  envVars: envVarsProp,
  onChange,
}: UseEnvVarsProps): UseEnvVarsReturn {
  const [envVarsState, setEnvVarsState] = useState<EnvVar[]>([])
  const envVars = envVarsProp || envVarsState

  const handleChange = useCallback(
    (envVar: EnvVar) => {
      if (!envVars) return

      const newEnvVars = [...envVars]
      const i = envVars.findIndex((vol) => vol.id === envVar.id)
      newEnvVars[i] = envVar

      setEnvVarsState(newEnvVars)
      onChange(newEnvVars)
    },
    [onChange, envVars],
  )

  const handleAdd = useCallback(() => {
    const newEnvVar = {
      ...defaultEnvVar,
      id: `envvar-${Date.now()}`,
    }

    const newEnvVars = [...envVars, newEnvVar]

    setEnvVarsState(newEnvVars)
    onChange(newEnvVars)
  }, [onChange, envVars])

  const handleRemove = useCallback(
    (envVarId: string) => {
      if (!envVars) return

      const newEnvVars = envVars.filter((vol) => vol.id !== envVarId)

      setEnvVarsState(newEnvVars)
      onChange(newEnvVars)
    },
    [onChange, envVars],
  )

  return {
    envVars,
    handleChange,
    handleAdd,
    handleRemove,
  }
}
