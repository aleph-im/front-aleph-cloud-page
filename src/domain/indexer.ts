import { Account } from '@aleph-sdk/account'
import { EntityManager } from './types'
import {
  AddProgram,
  Program,
  ProgramCost,
  ProgramCostProps,
  ProgramManager,
} from './program'
import { indexerSchema } from '@/helpers/schemas/indexer'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { getDefaultSpecsOptions } from '@/hooks/form/useSelectInstanceSpecs'
import { Encoding } from '@aleph-sdk/message'
import { FunctionCodeField } from '@/hooks/form/useAddFunctionCode'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import { toKebabCase, toSnakeCase } from '@/helpers/utils'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { VolumeType } from './volume'
import { IndexerBlockchainNetworkField } from '@/hooks/form/useAddIndexerBlockchainNetworks'
import { IndexerTokenAccountField } from '@/hooks/form/useAddIndexerTokenAccounts'
import { BlockchainDefaultABIUrl, CheckoutStepType } from '@/helpers/constants'
import { FunctionLangId, FunctionLanguage } from './lang'
import {
  AlephHttpClient,
  AuthenticatedAlephHttpClient,
} from '@aleph-sdk/client'
import Err from '@/helpers/errors'

export type AddIndexer = NameAndTagsField & {
  networks: IndexerBlockchainNetworkField[]
  accounts: IndexerTokenAccountField[]
}

export type Indexer = Program

export type IndexerCostProps = ProgramCostProps
export type IndexerCost = ProgramCost

export class IndexerManager implements EntityManager<Indexer, AddIndexer> {
  static addSchema = indexerSchema

  static async getCost(props: IndexerCostProps): Promise<IndexerCost> {
    const { specs } = this.getStaticProgramConfig()

    return ProgramManager.getCost({
      ...props,
      isPersistent: true,
      specs,
    })
  }

  static getStaticProgramConfig() {
    const isPersistent = true
    const metadata = { indexer: true }
    const specs = { ...getDefaultSpecsOptions(true)[1] }
    const code: FunctionCodeField = {
      lang: FunctionLangId.Node,
      type: 'ref',
      encoding: Encoding.squashfs,
      entrypoint: 'dist/run.js',
      programRef:
        '32c3ac6e4810a18d3d3f64cb4dd6b2eb111993e9f9832124d3ad5efba93ce13e', // @note: token program
    }
    const runtime = FunctionLanguage[code.lang].runtime
    const volumes: VolumeField[] = [
      {
        volumeType: VolumeType.Persistent,
        name: 'data',
        mountPath: '/data',
        size: 40960,
      },
    ]

    return {
      isPersistent,
      metadata,
      specs,
      runtime,
      code,
      volumes,
    }
  }

  constructor(
    protected account: Account,
    protected sdkClient: AlephHttpClient | AuthenticatedAlephHttpClient,
    protected programManager: ProgramManager,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSteps(entity: AddIndexer | AddIndexer[]): Promise<CheckoutStepType[]> {
    throw Err.MethodNotImplemented
  }

  addSteps(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entity: AddIndexer | AddIndexer[],
  ): AsyncGenerator<void, Program | Program[], void> {
    throw Err.MethodNotImplemented
  }

  async getAll(): Promise<Indexer[]> {
    try {
      const programs = await this.programManager.getAll()
      return programs.filter((p) => !!p.metadata?.indexer)
    } catch (err) {
      return []
    }
  }

  async get(id: string): Promise<Indexer | undefined> {
    const program = await this.programManager.get(id)
    if (!program?.metadata?.indexer) return
    return program
  }

  async add(newIndexer: AddIndexer): Promise<Indexer> {
    const newProgram = await this.parseIndexers(newIndexer)
    return await this.programManager.add(newProgram)
  }

  async del(indexerOrId: string | Indexer): Promise<void> {
    await this.programManager.del(indexerOrId)
  }

  protected parseEnvVars(newIndexer: AddIndexer): EnvVarField[] {
    const INDEXER_BLOCKCHAINS = newIndexer.networks
      .map((network) => {
        const { id, blockchain } = network
        return blockchain === id ? id : `${blockchain}:${id}`
      })
      .join(',')

    const INDEXER_NAMESPACE = toKebabCase(newIndexer.name)

    const NETWORKS_CONFIG = newIndexer.networks.reduce(
      (ac, cu) => {
        ac[this.getBlockchainEnvName(cu.id, 'INDEX_LOGS')] = 'true'
        ac[this.getBlockchainEnvName(cu.id, 'INDEX_BLOCKS')] = 'false'
        ac[this.getBlockchainEnvName(cu.id, 'INDEX_TRANSACTIONS')] = 'false'
        ac[this.getBlockchainEnvName(cu.id, 'RPC')] = cu.rpcUrl
        ac[this.getBlockchainEnvName(cu.id, 'EXPLORER_URL')] = cu.abiUrl
          ? cu.abiUrl
          : BlockchainDefaultABIUrl[cu.blockchain]
        return ac
      },
      {} as Record<string, string>,
    )

    const INDEXER_ACCOUNTS = newIndexer.accounts
      .map(
        ({ network, contract, deployer, supply, decimals }) =>
          `${network}:${contract}:${deployer}:${supply}:${decimals}`,
      )
      .join(',')

    return Object.entries({
      ...NETWORKS_CONFIG,
      INDEXER_ACCOUNTS,
      INDEXER_NAMESPACE,
      INDEXER_BLOCKCHAINS,
      INDEXER_DATA_PATH: '/data',
    }).map(([name, value]) => ({ name, value }))
  }

  protected async parseIndexers(newIndexer: AddIndexer): Promise<AddProgram> {
    newIndexer = await IndexerManager.addSchema.parseAsync(newIndexer)

    const { name, tags } = newIndexer
    const envVars = this.parseEnvVars(newIndexer)
    const { code, specs, runtime, metadata, isPersistent, volumes } =
      IndexerManager.getStaticProgramConfig()

    return {
      code,
      name,
      tags,
      specs,
      runtime,
      envVars,
      volumes,
      metadata,
      isPersistent,
    }
  }

  protected getBlockchainEnvName(blockchainId: string, name: string): string {
    return toSnakeCase(`${blockchainId}_${name}`).toUpperCase()
  }

  async getDelSteps(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    indexersOrIds: string | Indexer | (string | Indexer)[],
  ): Promise<CheckoutStepType[]> {
    throw Err.MethodNotImplemented
    /* indexersOrIds = Array.isArray(indexersOrIds)
      ? indexersOrIds
      : [indexersOrIds]
    return indexersOrIds.map(() => 'indexerDel') */
  }

  async *addDelSteps(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    indexersOrIds: string | Indexer | (string | Indexer)[],
  ): AsyncGenerator<void> {
    throw Err.MethodNotImplemented
    /* if (!(this.sdkClient instanceof AuthenticatedAlephHttpClient))
      throw Err.InvalidAccount

    indexersOrIds = Array.isArray(indexersOrIds)
      ? indexersOrIds
      : [indexersOrIds]
    if (indexersOrIds.length === 0) return

    try {
      for (const indexerOrId of indexersOrIds) {
        yield
        await this.del(indexerOrId)
      }
    } catch (err) {
      throw Err.RequestFailed(err)
    } */
  }
}
