import { EnvVar } from '@/hooks/form/useAddEnvVars'

export type EnvVarItemProps = {
  envVar: EnvVar
  onChange: (envVar: EnvVar) => void
  onRemove: (envVarId: string) => void
}

export type AddEnvVarsProps = {
  envVars?: EnvVar[]
  onChange: (envVars: EnvVar[]) => void
}
