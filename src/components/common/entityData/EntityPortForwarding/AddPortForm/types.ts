import { FieldArrayWithId } from 'react-hook-form'
import { NewForwardedPortEntry } from '../types'

export type AddPortFormProps = {
  onSubmit: (data: NewForwardedPortEntry[]) => void
  onCancel: () => void
}

export type UseAddPortFormProps = {
  onSubmit: (data: NewForwardedPortEntry[]) => void
  onCancel: () => void
}

export type UseAddPortFormReturn = {
  name: string
  control: any
  fields: FieldArrayWithId[]
  handleSubmit: (e: React.FormEvent) => Promise<void>
  addPortField: () => void
  removePortField: (index: number) => void
}
