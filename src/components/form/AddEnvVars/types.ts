import { EnvVarProp } from '@/hooks/form/useAddEnvVars'

export type EnvVarItemProps = {
  envVar: EnvVarProp
  onChange: (envVar: EnvVarProp) => void
  onRemove: (envVarId: string) => void
}

export type AddEnvVarsProps = {
  envVars?: EnvVarProp[]
  onChange: (envVars: EnvVarProp[]) => void
}
