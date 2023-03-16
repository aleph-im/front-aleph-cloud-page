import { EphemeralVolume, MachineVolume } from "aleph-sdk-ts/dist/messages/program/programModel"

const samplePythonCode = `
from fastapi import FastAPI

app = FastAPI()
@app.get("/")
async def root():
  return {"message": "Hello World"}
`

type AvailableRuntimes = 'default_interpreted' | 'default_binary' | 'custom'

export const runtimeRefs: Record<Exclude<AvailableRuntimes, "custom">, string> = {
  default_interpreted: 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  default_binary: "UNDEFINED", // TODO: add default binary hash
}

export type FormState = {
  runtime: AvailableRuntimes
  customRuntimeHash?: string
  isPersistent: boolean
  functionName: string
  functionTags: string[]
  volumes: MachineVolume[]
  codeOrFile: 'code' | 'file'
  functionCode?: string
  functionFile?: File
}

const defaultVolume: EphemeralVolume = {
  ephemeral: true,
  size_mib: 2048,
  is_read_only: () => false,
}

export const initialFormState: FormState = {
  runtime: 'default_interpreted',
  isPersistent: false,
  functionName: "",
  functionTags: [],
  volumes: [defaultVolume],
  functionCode: samplePythonCode,
  codeOrFile: 'code'
}