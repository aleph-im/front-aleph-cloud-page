import { FunctionLangId } from '@/domain/lang'
import { Encoding } from 'aleph-sdk-ts/dist/messages/program/programModel'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export const defaultCodeText = `from fastapi import FastAPI

app = FastAPI()
@app.get("/")
async def root():
  return {"message": "Hello World"}
`

export const defaultCode: Partial<FunctionCodeField> = {
  lang: FunctionLangId.Python,
  type: 'file',
  entrypoint: 'main:app',
}

export type FunctionCodeField = {
  lang: FunctionLangId
} & (
  | {
      type: 'text'
      entrypoint?: string
      text: string
      ref?: undefined
      file?: undefined
    }
  | {
      type: 'ref'
      encoding: Encoding
      entrypoint: string
      programRef: string
      text?: undefined
      file?: undefined
    }
  | {
      type: 'file'
      entrypoint: string
      file: File
      text?: undefined
      ref?: undefined
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
  entryPointCtrl: UseControllerReturn<any, any>
}

export function useAddFunctionCode({
  name = 'code',
  control,
  defaultValue,
}: UseAddFunctionCodeProps): UseAddFunctionCodeReturn {
  const langCtrl = useController({
    control,
    name: `${name}.lang`,
    defaultValue: defaultValue?.lang,
  })

  const entryPointCtrl = useController({
    control,
    name: `${name}.entrypoint`,
    defaultValue: defaultValue?.entrypoint,
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
    defaultValue: defaultValue?.text,
  })

  return {
    langCtrl,
    typeCtrl,
    fileCtrl,
    textCtrl,
    entryPointCtrl,
  }
}
