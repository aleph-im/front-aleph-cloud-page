import { createVolume } from "@/helpers/aleph"
import { EnvironmentVariable } from "@/helpers/utils"
import { Account } from "aleph-sdk-ts/dist/accounts/account"
import { MachineVolume, PersistentVolume } from "aleph-sdk-ts/dist/messages/program/programModel"

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

export const defaultVolume: Volume = {
  type: 'new',
  size: 2,
  useLatest: true
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
export const displayVolumesToAlephVolumes = async (account: Account, volumes: Volume[]): Promise<(MachineVolume | PersistentVolume)[]> => {
  const ret = []

  for(const volume of volumes) {
    if(volume.type === 'new' && volume.src) {
      const createdVolume = await createVolume(account, volume.src);
      ret.push({
        ref: createdVolume.item_hash,
        mount: volume.mountpoint || "",
        use_latest: false
      })
    } else if(volume.type === 'existing') {
      ret.push({
        ref: volume.refHash || "",
        mount: volume.mountpoint || "",
        use_latest: volume.useLatest || false,
        size_mib: (volume.size || 2) * 1000,
      })
    } else if(volume.type === 'persistent') {
      ret.push({
        persistence: "host",
        mount: volume.mountpoint || "",
        size_mib: (volume.size || 2) * 1000,
        name: volume.name || "",
        is_read_only: () => false
      })
    }
  }

  // @fixme: remove any and fix type error
  return ret as any
}

export const nonEmptyString = (s: string) => s.trim().length > 0

export const validateHash = (hash: string) => {}