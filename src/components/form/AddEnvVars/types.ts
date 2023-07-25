import { EnvVarProp } from '@/hooks/form/useAddEnvVars'

export type EnvVarItemProps = {
  envVar: EnvVarProp
  onChange: (envVar: EnvVarProp) => void
  onRemove: (envVarId: string) => void
}

export type AddEnvVarsProps = {
  value?: EnvVarProp[]
  onChange: (envVars: EnvVarProp[]) => void
}
