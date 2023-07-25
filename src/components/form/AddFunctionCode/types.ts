import { FunctionCodeProp } from '@/hooks/form/useAddFunctionCode'

export type AddFunctionCodeProps = {
  value?: FunctionCodeProp
  onChange: (code: FunctionCodeProp) => void
}
