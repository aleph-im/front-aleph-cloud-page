import { Control } from 'react-hook-form'

export type EnvVarItemProps = {
  name?: string
  index: number
  control: Control
  onRemove: (index?: number) => void
}

export type AddEnvVarsProps = {
  name: string
  control: Control
}
