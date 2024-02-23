import JSZip from 'jszip'
import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { forget, program, any } from 'aleph-sdk-ts/dist/messages'
import { ProgramPublishConfiguration } from 'aleph-sdk-ts/dist/messages/program/publish'
import { Encoding, ProgramContent } from 'aleph-sdk-ts/dist/messages/types'
import E_ from '../helpers/errors'
import {
  EntityType,
  apiServer,
  defaultProgramChannel,
  defaultVMURL,
  programStorageURL,
} from '../helpers/constants'
import { downloadBlob, getDate, getExplorerURL } from '../helpers/utils'
import {
  MachineVolume,
  MessageType,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/types'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import {
  Executable,
  ExecutableCost,
  ExecutableCostProps,
  PaymentConfiguration,
} from './executable'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { CustomFunctionRuntimeField } from './runtime'
import { FileManager } from './file'
import { MessageManager } from './message'
import { VolumeManager } from './volume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { AddDomain, DomainManager } from './domain'
import { EntityManager } from './types'
import { FunctionCodeField } from '@/hooks/form/useAddFunctionCode'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { functionSchema } from '@/helpers/schemas/program'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { FunctionLangId, FunctionLanguage } from './lang'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'

export type AddProgram = Omit<
  ProgramPublishConfiguration,
  | 'account'
  | 'channel'
  | 'file'
  | 'programRef'
  | 'vcpus'
  | 'memory'
  | 'runtime'
  | 'volumes'
  | 'entrypoint'
  | 'payment'
> &
  NameAndTagsField & {
    isPersistent: boolean
    code: FunctionCodeField
    specs: InstanceSpecsField
    runtime?: CustomFunctionRuntimeField
    envVars?: EnvVarField[]
    volumes?: VolumeField[]
    domains?: Omit<DomainField, 'ref'>[]
    payment?: PaymentConfiguration
  }

// @todo: Refactor
export type Program = Omit<ProgramContent, 'type'> & {
  type: EntityType.Program
  id: string // hash
  url: string
  urlVM: string
  date: string
  size?: number
  confirmed?: boolean
}

export type ProgramCostProps = Omit<ExecutableCostProps, 'type'> & {
  isPersistent: boolean
}

export type ProgramCost = ExecutableCost

export type ParsedCodeType = {
  encoding: Encoding
  entrypoint: string
} & (
  | {
      file?: undefined
      programRef: string
    }
  | {
      file: Blob | Buffer
      programRef?: undefined
    }
)

export class ProgramManager
  extends Executable
  implements EntityManager<Program, AddProgram>
{
  static addSchema = functionSchema

  /**
   * Reference: https://medium.com/aleph-im/aleph-im-tokenomics-update-nov-2022-fd1027762d99
   */
  static async getCost(props: ProgramCostProps): Promise<ProgramCost> {
    return Executable.getExecutableCost({
      ...props,
      type: EntityType.Program,
    })
  }

  constructor(
    protected account: Account,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected messageManager: MessageManager,
    protected fileManager: FileManager,
    protected channel = defaultProgramChannel,
  ) {
    super(account, volumeManager, domainManager)
  }

  async getAll(): Promise<Program[]> {
    try {
      const response = await any.GetMessages({
        addresses: [this.account.address],
        messageType: MessageType.program,
        channels: [this.channel],
        APIServer: apiServer,
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
      APIServer: apiServer,
    })

    const [entity] = await this.parseMessages([message])
    return entity
  }

  async add(newProgram: AddProgram): Promise<Program> {
    const steps = this.addSteps(newProgram)

    while (true) {
      const { value, done } = await steps.next()
      if (done) return value
    }
  }

  async *addSteps(newProgram: AddProgram): AsyncGenerator<void, Program, void> {
    try {
      const programMessage = yield* this.parseProgramSteps(newProgram)

      yield
      const response = await program.publish({
        ...programMessage,
        APIServer: apiServer,
      })

      const [entity] = await this.parseMessages([response])

      // @note: Add the domain link
      yield* this.parseDomainsSteps(entity.id, newProgram.domains)

      return entity
    } catch (err) {
      throw E_.RequestFailed(err)
    }
  }

  async del(programOrId: string | Program): Promise<void> {
    programOrId = typeof programOrId === 'string' ? programOrId : programOrId.id

    try {
      await forget.Publish({
        account: this.account,
        channel: this.channel,
        hashes: [programOrId],
        APIServer: apiServer,
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

  async getSteps(newInstance: AddProgram): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    const { volumes = [], domains = [] } = newInstance

    const volumeSteps = await this.volumeManager.getSteps(volumes)
    for (const step of volumeSteps) steps.push(step)

    steps.push('program')

    const domainSteps = await this.domainManager.getSteps(
      domains as AddDomain[],
    )
    for (const step of domainSteps) steps.push(step)

    return steps
  }

  protected async parseCode(code: FunctionCodeField): Promise<ParsedCodeType> {
    if (code.type === 'text') {
      const jsZip = new JSZip()
      const fileExt = code.lang === FunctionLangId.Python ? 'py' : 'js'
      jsZip.file('main.' + fileExt, code.text)
      const zip = await jsZip.generateAsync({ type: 'blob' })

      return {
        entrypoint: 'main:app',
        file: zip as File,
        encoding: Encoding.zip,
      }
    } else if (code.type === 'file') {
      if (!code.file) throw new Error('Invalid function code file')
      const fileName = code.file.name

      let encoding: Encoding

      if (fileName.endsWith('.zip')) {
        encoding = Encoding.zip
      } else if (fileName.endsWith('.sqsh')) {
        encoding = Encoding.squashfs
      } else {
        throw new Error('Invalid function code file')
      }

      return {
        entrypoint: code.entrypoint,
        file: code.file,
        encoding,
      }
    } else if (code.type === 'ref') {
      return {
        entrypoint: code.entrypoint,
        encoding: code.encoding,
        programRef: code.programRef,
      }
    } else throw new Error('Invalid function code type')
  }

  protected async *parseProgramSteps(
    newProgram: AddProgram,
  ): AsyncGenerator<void, ProgramPublishConfiguration, void> {
    newProgram = await ProgramManager.addSchema.parseAsync(newProgram)

    const { account, channel } = this

    const { name, tags, isPersistent, envVars, specs } = newProgram

    const variables = this.parseEnvVars(envVars)
    const { memory, vcpus } = this.parseSpecs(specs)
    const metadata = this.parseMetadata(name, tags, newProgram.metadata)
    const runtime = this.parseRuntime(newProgram)
    const payment = this.parsePayment(newProgram.payment)
    const volumes = yield* this.parseVolumesSteps(newProgram.volumes)
    const code = await this.parseCode(newProgram.code)

    return {
      account,
      channel,
      runtime,
      isPersistent,
      variables,
      memory,
      vcpus,
      volumes,
      ...code,
      metadata,
      payment,
    }
  }

  protected parseRuntime({ code, runtime }: AddProgram): string {
    if (runtime) return runtime

    if (code.lang === FunctionLangId.Other)
      throw new Error('Custom runtime should be added')

    return FunctionLanguage[code.lang].runtime
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
          confirmed: !!message.confirmed,
        }
      })
  }
}
