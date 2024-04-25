import { FieldError } from 'react-hook-form'

export type HiddenFileInputProps = {
  onChange: (files?: File | FileList) => void
  accept?: string
  value?: File | FileList
  children: React.ReactNode
  error?: FieldError
  label?: string
  required?: boolean
  isFolder?: boolean
}
