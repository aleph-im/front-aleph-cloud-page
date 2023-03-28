import { MachineVolume } from "aleph-sdk-ts/dist/messages/program/programModel"

const samplePythonCode = `
from fastapi import FastAPI

app = FastAPI()
@app.get("/")
async def root():
  return {"message": "Hello World"}
`

type AvailableRuntimes = 'default_interpreted' | 'default_binary' | 'custom'

export type VolumeTypes = 'new' | 'existing' | 'persistent'

export type Volume = {
  type: VolumeTypes,
  refHash?: string,
  size?: number,
  src?: File, 
  mountpoint?: string
  name?: string
}

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
  volumes: Volume[]
  codeOrFile: 'code' | 'file'
  functionCode?: string
  functionFile?: File
  computeUnits: number
}

const defaultVolume: Volume = {
  type: 'new',
  size: 2
}

export const initialFormState: FormState = {
  runtime: 'default_interpreted',
  isPersistent: false,
  functionName: "",
  functionTags: [],
  volumes: [
    defaultVolume
  ],
  functionCode: samplePythonCode,
  codeOrFile: 'code',
  computeUnits: 1
}

/**
 * Convert a list of volume objects from the form to a list of volume objects for the Aleph API
 */
export const displayVolumesToAlephVolumes = (volumes: Volume[]): MachineVolume[] => {
  // TODO: implement this function
  // return volumes.map((volume) => {
  // })

  return []
}