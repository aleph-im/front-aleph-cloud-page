import { FieldError } from 'react-hook-form'

export type HiddenFileInputProps = {
  onChange: (files?: File | FileList) => any
  accept?: string
  value?: File | FileList
  children: React.ReactNode
  error?: FieldError
  directory?: boolean
  label?: string
  required?: boolean
}
