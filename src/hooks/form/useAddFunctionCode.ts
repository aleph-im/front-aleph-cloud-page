import { formValidationRules } from '@/helpers/errors'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

const defaultText = `from fastapi import FastAPI

app = FastAPI()
@app.get("/")
async def root():
  return {"message": "Hello World"}
`

export const defaultCode: FunctionCodeField = {
  lang: 'python',
  type: 'text',
  text: defaultText,
}

export type FunctionCodeField = {
  lang: string
  type: 'text' | 'file'
  text?: string
  file?: File
}

export type UseAddFunctionCodeProps = {
  name?: string
  control: Control
  defaultValue?: FunctionCodeField
}

export type UseAddFunctionCodeReturn = {
  langCtrl: UseControllerReturn<any, any>
  typeCtrl: UseControllerReturn<any, any>
  fileCtrl: UseControllerReturn<any, any>
  textCtrl: UseControllerReturn<any, any>
}

export function useAddFunctionCode({
  name = 'code',
  control,
  defaultValue = defaultCode,
}: UseAddFunctionCodeProps): UseAddFunctionCodeReturn {
  const { required } = formValidationRules

  const langCtrl = useController({
    control,
    name: `${name}.lang`,
    defaultValue: defaultValue?.lang,
    rules: { required },
  })

  const typeCtrl = useController({
    control,
    name: `${name}.type`,
    defaultValue: defaultValue?.type,
    rules: { required },
  })

  const isText = typeCtrl.field.value === 'text'

  const fileCtrl = useController({
    control,
    name: `${name}.file`,
    defaultValue: defaultValue?.file,
    rules: {
      validate: {
        required: (v) => isText || !!v,
      },
    },
  })

  const textCtrl = useController({
    control,
    name: `${name}.name`,
    defaultValue: defaultCode?.text,
    rules: {
      validate: {
        required: (v) => !isText || !!v,
      },
    },
  })

  return {
    langCtrl,
    typeCtrl,
    fileCtrl,
    textCtrl,
  }
}
