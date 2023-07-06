import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { forget, program, any } from 'aleph-sdk-ts/dist/messages'
// import { ProgramPublishConfiguration } from 'aleph-sdk-ts/dist/messages/program/publish'
import { Encoding } from 'aleph-sdk-ts/dist/messages/program/programModel'
import E_ from '../helpers/errors'
import {
  EntityType,
  defaultProgramChannel,
  defaultVMURL,
  programStorageURL,
} from '../helpers/constants'
import {
  downloadBlob,
  getDate,
  getExplorerURL,
  isValidItemHash,
} from '../helpers/utils'
import {
  ProgramMessage,
  ItemType,
  MachineVolume,
  MessageType,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/types'
import { EnvVarProp } from '@/hooks/form/useAddEnvVars'
import { ProgramContent } from 'aleph-sdk-ts/dist/messages/program/programModel'
import JSZip from 'jszip'
import { InstanceSpecsProp } from '@/hooks/form/useSelectInstanceSpecs'
import { Executable } from './executable'
import { VolumeProp } from '@/hooks/form/useAddVolume'
import { FunctionRuntime, FunctionRuntimeId } from './runtime'
import { FileManager } from './file'
import { MessageManager } from './message'

// @todo: Export this type from sdk and remove here
declare type ProgramPublishConfiguration = {
  account: Account
  channel: string
  isPersistent?: boolean
  storageEngine?: ItemType.ipfs | ItemType.storage
  inlineRequested?: boolean
  APIServer?: string
  file?: Buffer | Blob
  programRef?: string
  encoding?: Encoding
  entrypoint: string
  subscription?: Record<string, unknown>[]
  memory?: number
  vcpus?: number
  runtime?: string
  volumes?: MachineVolume[]
  metadata?: Record<string, unknown>
  variables?: Record<string, string>
}

export type NewProgram = Omit<
  ProgramPublishConfiguration,
  | 'account'
  | 'channel'
  | 'file'
  | 'vcpus'
  | 'memory'
  | 'runtime'
  | 'volumes'
  | 'entrypoint'
> & {
  file?: string | File
  entrypoint?: string
  isPersistent: boolean
  runtime?: FunctionRuntime
  name?: string
  tags?: string[]
  envVars?: EnvVarProp[]
  specs?: InstanceSpecsProp
  volumes?: VolumeProp[]
}

// @todo: Refactor
export type Program = Omit<ProgramContent, 'type'> & {
  type: EntityType.Program
  id: string // hash
  url: string
  urlVM: string
  date: string
  size?: number
}

export class ProgramManager extends Executable {
  constructor(
    protected account: Account,
    protected channel = defaultProgramChannel,
    protected fileManager = new FileManager(account),
    protected messageManager = new MessageManager(account),
  ) {
    super(account)
  }

  async getAll(): Promise<Program[]> {
    try {
      const response = await any.GetMessages({
        addresses: [this.account.address],
        messageType: MessageType.program,
        channels: [this.channel],
      })

      return await this.parseMessages(response.messages)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Program | undefined> {
    const message = await any.GetMessage({
      hash: id,
      messageType: MessageType.program,
      channel: this.channel,
    })

    const [data] = await this.parseMessages([message])
    return data
  }

  async add(newProgram: NewProgram): Promise<ProgramMessage> {
    try {
      const { account, channel } = this
      const {
        name,
        tags,
        isPersistent,
        envVars,
        specs,
        entrypoint = 'main:app', // @todo: Entrypoint,
      } = newProgram

      const variables = this.parseEnvVars(envVars)
      const { memory, vcpus } = this.parseSpecs(specs)
      const metadata = this.parseMetadata(name, tags)
      const runtime = this.parseRuntime(newProgram.runtime)
      const volumes = await this.parseVolumes(newProgram.volumes)
      const file = await this.parseCode(newProgram.file)

      return await program.publish({
        account,
        channel,
        runtime,
        isPersistent,
        entrypoint,
        file,
        variables,
        memory,
        vcpus,
        volumes,
        metadata,
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(programOrId: string | Program) {
    programOrId = typeof programOrId === 'string' ? programOrId : programOrId.id

    try {
      return await forget.Publish({
        account: this.account,
        channel: this.channel,
        hashes: [programOrId],
      })
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async download(program: Program): Promise<void> {
    const ref = program.code.ref
    const storeMessage = (await this.messageManager.get(ref)) as StoreMessage
    const volumeRef = storeMessage.content.item_hash

    const req = await fetch(`${programStorageURL}${volumeRef}`)
    const blob = await req.blob()

    return downloadBlob(blob, `VM_${program.id.slice(-12)}.zip`)
  }

  protected async parseCode(codeOrFile?: string | File): Promise<File> {
    if (typeof codeOrFile === 'string') {
      const jsZip = new JSZip()
      jsZip.file('main.py', codeOrFile || '')
      const zip = await jsZip.generateAsync({ type: 'blob' })
      return new File([zip], 'main.py.zip', { type: 'application/zip' })
    }

    if (codeOrFile instanceof File) {
      return codeOrFile
    }

    throw new Error('Invalid code or file')
  }

  protected parseRuntime(runtime?: FunctionRuntime): string {
    const ref = (
      runtime?.id !== FunctionRuntimeId.Custom
        ? runtime?.id || ''
        : runtime.meta || ''
    ).trim()

    if (!ref || !isValidItemHash(ref)) throw new Error('Invalid runtime ref')

    return ref
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async parseMessages(messages: any[]): Promise<Program[]> {
    const sizesMap = await this.fileManager.getSizesMap()

    return messages
      .filter(({ content }) => content !== undefined)
      .map((message) => {
        const size = message.content.volumes.reduce(
          (ac: number, cv: MachineVolume) =>
            ac + ('size_mib' in cv ? cv.size_mib : sizesMap[cv.ref]),
          0,
        )

        return {
          id: message.item_hash,
          ...message.content,
          type: EntityType.Program,
          url: getExplorerURL(message),
          urlVM: `${defaultVMURL}${message.item_hash}`,
          date: getDate(message.time),
          size,
        }
      })
  }
}
