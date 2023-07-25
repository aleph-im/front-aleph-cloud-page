import { ChangeEvent, useCallback, useState } from 'react'

const defaultCodeString = `from fastapi import FastAPI

app = FastAPI()
@app.get("/")
async def root():
  return {"message": "Hello World"}
`

export const defaultCode: FunctionCodeProp = {
  lang: 'python',
  code: defaultCodeString,
}

export type FunctionCodeProp = {
  lang: string
  code?: string | File
}

export type UseAddFunctionCodeProps = {
  value?: FunctionCodeProp
  onChange: (code: FunctionCodeProp) => void
}

export type UseAddFunctionCodeReturn = {
  tab: string
  code: FunctionCodeProp
  codeFile?: File
  codeString?: string
  handleTabChange: (tab: string) => void
  handleCodeFileChange: (codeFile?: File) => void
  handleCodeStringChange: (codeString?: string) => void
  handleCodeLanguageChange: (
    _: ChangeEvent<HTMLInputElement>,
    lang: unknown,
  ) => void
}

export function useAddFunctionCode({
  value: codeProp,
  onChange,
}: UseAddFunctionCodeProps): UseAddFunctionCodeReturn {
  const [codeState, setCodeState] = useState<FunctionCodeProp>(defaultCode)
  const code = codeProp || codeState

  const [tab, setTab] = useState<string>('string')
  const [codeFile, setCodeFile] = useState<File | undefined>()
  const [codeString, setCodeString] = useState<string | undefined>(
    defaultCodeString,
  )

  const handleCodeFileChange = useCallback(
    (codeFile?: File) => {
      setCodeFile(codeFile)

      if (tab !== 'file') return

      const updatedCode = { ...code, code: codeFile }

      setCodeState(updatedCode)
      onChange(updatedCode)
    },
    [code, onChange, tab],
  )

  const handleCodeStringChange = useCallback(
    (codeString?: string) => {
      setCodeString(codeString)

      if (tab !== 'string') return

      const updatedCode = { ...code, code: codeString }

      setCodeState(updatedCode)
      onChange(updatedCode)
    },
    [code, onChange, tab],
  )

  const handleTabChange = useCallback(
    (tab: string) => {
      setTab(tab)

      const updatedCode = {
        ...code,
        code: tab === 'string' ? codeString : codeFile,
      }

      setCodeState(updatedCode)
      onChange(updatedCode)
    },
    [code, codeFile, codeString, onChange],
  )

  const handleCodeLanguageChange = useCallback(
    (_: ChangeEvent<HTMLInputElement>, value: unknown) => {
      if (!value) return

      const updatedCode = { ...code, lang: value as string }

      setCodeState(updatedCode)
      onChange(updatedCode)
    },
    [code, onChange],
  )

  return {
    tab,
    code,
    codeFile,
    codeString,
    handleTabChange,
    handleCodeFileChange,
    handleCodeStringChange,
    handleCodeLanguageChange,
  }
}
