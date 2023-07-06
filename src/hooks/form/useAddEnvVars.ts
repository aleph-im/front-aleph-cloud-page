import { ChangeEvent, useCallback, useId, useState } from 'react'

export type EnvVarProp = {
  id: string
  name: string
  value: string
}

export const defaultEnvVar: EnvVarProp = {
  id: `envvar-0`,
  name: '',
  value: '',
}

export type UseEnvVarItemProps = {
  envVar: EnvVarProp
  onChange: (envVars: EnvVarProp) => void
  onRemove: (envVarId: string) => void
}

export type UseEnvVarItemReturn = {
  id: string
  envVar: EnvVarProp
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
      const newEnvVar: EnvVarProp = { ...envVar, name }
      onChange(newEnvVar)
    },
    [onChange, envVar],
  )

  const handleValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const newEnvVar: EnvVarProp = { ...envVar, value }
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
  envVars?: EnvVarProp[]
  onChange: (envVars: EnvVarProp[]) => void
}

export type UseEnvVarsReturn = {
  envVars: EnvVarProp[]
  handleChange: (envVars: EnvVarProp) => void
  handleAdd: () => void
  handleRemove: (envVarId: string) => void
}

export function useAddEnvVars({
  envVars: envVarsProp,
  onChange,
}: UseEnvVarsProps): UseEnvVarsReturn {
  const [envVarsState, setEnvVarsState] = useState<EnvVarProp[]>([])
  const envVars = envVarsProp || envVarsState

  const handleChange = useCallback(
    (envVar: EnvVarProp) => {
      const updatedEnvVars = [...envVars]
      const index = envVars.findIndex((envVar) => envVar.id === envVar.id)

      if (index !== -1) {
        updatedEnvVars[index] = envVar
      } else {
        updatedEnvVars.push(envVar)
      }

      setEnvVarsState(updatedEnvVars)
      onChange(updatedEnvVars)
    },
    [onChange, envVars],
  )

  const handleAdd = useCallback(() => {
    const newEnvVar = {
      ...defaultEnvVar,
      id: `envvar-${Date.now()}`,
    }

    const updatedEnvVars = [...envVars, newEnvVar]

    setEnvVarsState(updatedEnvVars)
    onChange(updatedEnvVars)
  }, [onChange, envVars])

  const handleRemove = useCallback(
    (envVarId: string) => {
      const updatedEnvVars = envVars.filter((envVar) => envVar.id !== envVarId)

      setEnvVarsState(updatedEnvVars)
      onChange(updatedEnvVars)
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
