import JSZip from 'jszip'
import { Account } from '@aleph-sdk/account'
import {
  Encoding,
  PaymentType,
  ProgramContent,
  ProgramPublishConfiguration,
} from '@aleph-sdk/message'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import {
  EntityType,
  PaymentMethod,
  defaultProgramChannel,
  defaultVMURL,
  programStorageURL,
} from '@/helpers/constants'
import { downloadBlob, getDate, getExplorerURL } from '@/helpers/utils'
import { MachineVolume, MessageType, StoreMessage } from '@aleph-sdk/message'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import { ExecutableManager } from './executable'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { CustomFunctionRuntimeField } from './runtime'
import { FileManager } from './file'
import { MessageManager } from './message'
import { VolumeManager } from './volume'
import { DomainField } from '@/hooks/form/useAddDomains'
import { DomainManager } from './domain'
import { EntityManager } from './types'
import { FunctionCodeField } from '@/hooks/form/useAddFunctionCode'
import { InstanceSpecsField } from '@/hooks/form/useSelectInstanceSpecs'
import { functionSchema } from '@/helpers/schemas/program'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { FunctionLangId, FunctionLanguage } from './lang'
import { CheckoutStepType } from '@/hooks/form/useCheckoutNotification'
import Err from '@/helpers/errors'
import { NodeManager } from './node'
import { CostSummary } from './cost'
import { mockAccount } from './account'
import { fetchAllPages } from '@/helpers/pagination'

export const mockProgramRef =
  '79f19811f8e843f37ff7535f634b89504da3d8f03e1f0af109d1791cf6add7af'
export const mockEntrypoint = 'main:app'

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
  }

// @todo: Refactor
export type Program = Omit<ProgramContent, 'type'> & {
  type: EntityType.Program
  id: string // hash
  name: string
  url: string
  urlVM: string
  date: string
  size: number
  refUrl: string
  confirmed?: boolean
}

export type ProgramCostProps = AddProgram

export type ProgramCost = CostSummary

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
  extends ExecutableManager<Program>
  implements EntityManager<Program, AddProgram>
{
  static addSchema = functionSchema

  constructor(
    protected account: Account | undefined,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected volumeManager: VolumeManager,
    protected domainManager: DomainManager,
    protected messageManager: MessageManager,
    protected fileManager: FileManager,
    protected nodeManager: NodeManager,
    protected channel = defaultProgramChannel,
  ) {
    super(account, volumeManager, domainManager, nodeManager, sdkClient)
  }

  async getAll(): Promise<Program[]> {
    if (!this.account) return []

    const { address } = this.account

    try {
      const messages = await fetchAllPages(async (page, pageSize) => {
        const response = await this.sdkClient.getMessages({
          addresses: [address],
          messageTypes: [MessageType.program],
          channels: [this.channel],
          page,
          pagination: pageSize,
        })
        return {
          items: response.messages,
          hasMore: response.messages.length === pageSize,
        }
      })

      return await this.parseMessages(messages)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Program | undefined> {
    const message = await this.sdkClient.getMessage(id)

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
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    try {
      const programMessage = yield* this.parseProgramSteps(newProgram)

      yield
      const response = await this.sdkClient.createProgram({
        ...programMessage,
      })

      const [entity] = await this.parseMessages([response])

      // @note: Add the domain link
      yield* this.parseDomainsSteps(entity.id, newProgram.domains)

      return entity
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async del(programOrId: string | Program): Promise<void> {
    programOrId = typeof programOrId === 'string' ? programOrId : programOrId.id

    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    try {
      await this.sdkClient.forget({
        channel: this.channel,
        hashes: [programOrId],
      })
    } catch (err) {
      throw Err.RequestFailed(err)
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

  async getStreamPaymentDetails(): Promise<undefined> {
    // @note: Do not throw an error, just do nothing
    // @todo: Move this method to the Executable base classs
    return undefined
  }

  async getAddSteps(newInstance: AddProgram): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    const { domains = [] } = newInstance

    // Volumes are aggregated in 1 step, and there is always 1 for the code
    // @note: code volume is created in the same SDK call so only one step
    //steps.push('volume')

    steps.push('program')

    // @note: Aggregate all signatures in 1 step
    if (domains.length > 0) steps.push('domain')

    return steps
  }

  async getDelSteps(
    programsOrIds: string | Program | (string | Program)[],
  ): Promise<CheckoutStepType[]> {
    const steps: CheckoutStepType[] = []
    programsOrIds = Array.isArray(programsOrIds)
      ? programsOrIds
      : [programsOrIds]
    programsOrIds.forEach(() => {
      steps.push('volumeDel')
      steps.push('programDel')
    })
    return steps
  }

  async *delSteps(
    programsOrIds: string | Program | (string | Program)[],
  ): AsyncGenerator<void> {
    if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    programsOrIds = Array.isArray(programsOrIds)
      ? programsOrIds
      : [programsOrIds]
    if (programsOrIds.length === 0) return

    try {
      for (const programOrId of programsOrIds) {
        if (typeof programOrId !== 'string') {
          yield
          await this.volumeManager.del((programOrId as Program).code.ref)
        }
        yield
        await this.del(programOrId)
      }
    } catch (err) {
      throw Err.RequestFailed(err)
    }
  }

  async getTotalCostByHash(
    paymentMethod: PaymentMethod | PaymentType,
    hash: string,
  ): Promise<number> {
    const costs = await this.sdkClient.programClient.getCost(hash)
    return this.parseCost(paymentMethod, Number(costs.cost))
  }

  async getCost(newProgram: ProgramCostProps): Promise<ProgramCost> {
    let totalCost = Number.POSITIVE_INFINITY
    const paymentMethod = PaymentMethod.Credit

    const parsedProgram: ProgramPublishConfiguration =
      await this.parseProgramForCostEstimation(newProgram)

    const costs =
      await this.sdkClient.programClient.getEstimatedCost(parsedProgram)

    totalCost = Number(costs.cost)

    const lines = this.getExecutableCostLines(
      {
        type: EntityType.Program,
        isPersistent: newProgram.isPersistent,
        ...parsedProgram,
      },
      costs,
    )

    return {
      cost: this.parseCost(paymentMethod, totalCost),
      paymentMethod,
      lines: [...lines],
    }
  }

  protected async parseCodeForCostEstimation(
    code: FunctionCodeField,
  ): Promise<ParsedCodeType> {
    // @todo: calculate estimated_size_mib for code volume
    return {
      encoding: Encoding.zip,
      entrypoint: code.entrypoint || mockEntrypoint,
      programRef: mockProgramRef,
    }
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
      if (!code.file) throw Err.InvalidCodeFile
      const fileName = code.file.name

      let encoding: Encoding

      if (fileName.endsWith('.zip')) {
        encoding = Encoding.zip
      } else if (fileName.endsWith('.sqsh')) {
        encoding = Encoding.squashfs
      } else {
        throw Err.InvalidCodeFile
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
    } else throw Err.InvalidCodeType
  }

  protected async parseProgramForCostEstimation(
    newProgram: AddProgram,
  ): Promise<ProgramPublishConfiguration> {
    const { account = mockAccount, channel } = this
    const { isPersistent, specs } = newProgram

    const parsedSpecs = this.parseSpecs(specs)
    const memory = parsedSpecs?.memory
    const vcpus = parsedSpecs?.vcpus

    const runtime = this.parseRuntime(newProgram)
    const payment = this.parsePaymentForCostEstimation()
    const volumes = await this.parseVolumesForCostEstimation(newProgram.volumes)
    const code = await this.parseCodeForCostEstimation(newProgram.code)

    return {
      account,
      channel,
      runtime,
      isPersistent,
      memory,
      vcpus,
      volumes,
      ...code,
      payment,
    }
  }

  protected async *parseProgramSteps(
    newProgram: AddProgram,
  ): AsyncGenerator<void, ProgramPublishConfiguration, void> {
    if (!this.account) throw Err.InvalidAccount

    newProgram = await ProgramManager.addSchema.parseAsync(newProgram)

    const { account, channel } = this

    const { name, tags, isPersistent, envVars, specs } = newProgram

    const variables = this.parseEnvVars(envVars)

    const { memory, vcpus } = this.parseSpecs(specs) || {}

    const metadata = this.parseMetadata(name, tags, newProgram.metadata)
    const runtime = this.parseRuntime(newProgram)
    const payment = this.parsePayment()
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
    if (code.lang === FunctionLangId.Other) throw Err.CustomRuntimeNeeded
    return FunctionLanguage[code.lang].runtime
  }

  // @todo: Type not exported from SDK...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async parseMessages(messages: any[]): Promise<Program[]> {
    const sizesMap = await this.fileManager.getSizesMap()

    return messages
      .filter(({ content }) => content !== undefined)
      .map((message) => {
        const size =
          sizesMap[message.content.code.ref] +
          message.content.volumes.reduce(
            (ac: number, cv: MachineVolume) =>
              ac + ('size_mib' in cv ? cv.size_mib : sizesMap[cv.ref]),
            0,
          )

        return {
          id: message.item_hash,
          chain: message.chain,
          ...message.content,
          name: message.content.metadata?.name || 'Unnamed program',
          type: EntityType.Program,
          url: getExplorerURL(message),
          urlVM: `${defaultVMURL}${message.item_hash}`,
          date: getDate(message.time),
          size,
          refUrl: `/storage/volume/${message.content.code.ref}`,
          confirmed: !!message.confirmed,
        }
      })
  }
}
