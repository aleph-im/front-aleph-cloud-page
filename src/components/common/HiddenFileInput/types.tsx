import { FieldError } from 'react-hook-form'

export type HiddenFileInputProps = {
  onChange: (files?: File | string) => void
  accept?: string
  value?: File | string
  resetValue?: string
  children: React.ReactNode
  error?: FieldError
  label?: string
  required?: boolean
  remove?: boolean
}
