import { FormEvent, ReactNode } from 'react'
import { FieldErrors } from 'react-hook-form'

export type FormProps = {
  children: ReactNode
  onSubmit: (e: FormEvent<Element>) => Promise<void>
  errors: FieldErrors
  id?: string
}
