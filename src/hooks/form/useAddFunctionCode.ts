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
  lang: 'python' | 'javascript'
} & (
  | {
      type: 'text'
      text: string
      file?: File
    }
  | {
      type: 'file'
      file: File
      text?: string
    }
)

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
  const langCtrl = useController({
    control,
    name: `${name}.lang`,
    defaultValue: defaultValue?.lang,
  })

  const typeCtrl = useController({
    control,
    name: `${name}.type`,
    defaultValue: defaultValue?.type,
  })

  const fileCtrl = useController({
    control,
    name: `${name}.file`,
    defaultValue: defaultValue?.file,
  })

  const textCtrl = useController({
    control,
    name: `${name}.text`,
    defaultValue: defaultCode?.text,
  })

  return {
    langCtrl,
    typeCtrl,
    fileCtrl,
    textCtrl,
  }
}