import { FieldError } from 'react-hook-form'

export type HiddenFileInputProps = {
  onChange: (files?: File | FileList) => void
  accept?: string
  value?: File | FileList
  children: React.ReactNode
  error?: FieldError
  label?: string
  required?: boolean
  buttonStyle?: InputButtonStyle
  isFolder?: boolean
}

export type InputButtonStyle = {
  kind?: string
  variant?: string
  size?: 'sm' | 'md' | 'lg'
}
