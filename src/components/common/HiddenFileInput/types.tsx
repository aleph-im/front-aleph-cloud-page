import { FieldError } from 'react-hook-form'

export type HiddenFileInputProps = {
  onChange: (files?: File) => void
  accept?: string
  value?: File
  children: React.ReactNode
  error?: FieldError
  label?: string
  required?: boolean
}
