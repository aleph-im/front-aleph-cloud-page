import { createVolume } from "@/helpers/aleph"
import { EnvironmentVariable } from "@/helpers/utils"
import { Account } from "aleph-sdk-ts/dist/accounts/account"
import { MachineVolume } from "aleph-sdk-ts/dist/messages/program/programModel"

const samplePythonCode = `from fastapi import FastAPI

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
  useLatest?: boolean
}

export const runtimeRefs: Record<Exclude<AvailableRuntimes, "custom">, string> = {
  default_interpreted: 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
  default_binary: 'bd79839bf96e595a06da5ac0b6ba51dea6f7e2591bb913deccded04d831d29f4',
}

export type FormState = {
  runtime: AvailableRuntimes
  customRuntimeHash?: string
  isPersistent: boolean
  functionName: string
  functionTags: string[]
  volumes: Volume[]
  codeOrFile: 'code' | 'file'
  codeLanguage: string
  functionCode?: string
  functionFile?: File
  computeUnits: number,
  environmentVariables: EnvironmentVariable[]
  metaTags: string[]
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
  codeLanguage: 'python',
  codeOrFile: 'code',
  computeUnits: 1,
  environmentVariables: [],
  metaTags: []
}

/**
 * Convert a list of volume objects from the form to a list of volume objects for the Aleph API
 */
export const displayVolumesToAlephVolumes = async (account: Account, volumes: Volume[]): any => {
  // TODO: implement this function
  const ret = volumes.map((volume) => {
    if(volume.type === 'new') {
      // const createdVolume = await createVolume(account, volume.size || 2);

      // return {
      //   refHash: createdVolume.item_hash
      // }
    } else if(volume.type === 'existing') {
      return {
        ref: volume.refHash || "",
        mount: volume.mountpoint || "",
        useLatest: volume.useLatest || false
      }
    } else if(volume.type === 'persistent') {
      return {
        persistence: "host",
        mount: volume.mountpoint || "",
        size_mib: (volume.size || 2) * 1024,
        name: volume.name || ""
      }
    }
  })

  return ret
}