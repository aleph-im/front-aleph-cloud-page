import { Account } from 'aleph-sdk-ts/dist/accounts/account'
import { EntityManager } from './types'
import {
  AddProgram,
  Program,
  ProgramCost,
  ProgramCostProps,
  ProgramManager,
} from './program'
import { indexerSchema } from '@/helpers/schemas'
import { NameAndTagsField } from '@/hooks/form/useAddNameAndTags'
import { FunctionRuntimeId } from './runtime'
import { getDefaultSpecsOptions } from '@/hooks/form/useSelectInstanceSpecs'
import { Encoding } from 'aleph-sdk-ts/dist/messages/program/programModel'
import { FunctionCodeField } from '@/hooks/form/useAddFunctionCode'
import { EnvVarField } from '@/hooks/form/useAddEnvVars'
import { toKebabCase, toSnakeCase } from '@/helpers/utils'
import { VolumeField } from '@/hooks/form/useAddVolume'
import { VolumeType } from './volume'
import { IndexerBlockchainNetworkField } from '@/hooks/form/useAddIndexerBlockchainNetworks'
import { IndexerTokenAccountField } from '@/hooks/form/useAddIndexerTokenAccounts'
import { BlockchainDefaultABIUrl } from '@/helpers/constants'

export type AddIndexer = NameAndTagsField & {
  networks: IndexerBlockchainNetworkField[]
  accounts: IndexerTokenAccountField[]
}

export type Indexer = Program

export type IndexerCostProps = ProgramCostProps
export type IndexerCost = ProgramCost

export class IndexerManager implements EntityManager<Indexer, AddIndexer> {
  static addSchema = indexerSchema

  static getCost = (props: IndexerCostProps): IndexerCost => {
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
    const runtime = { id: FunctionRuntimeId.Runtime3 } // @note: Nodejs + nvm
    const code: FunctionCodeField = {
      type: 'ref',
      lang: 'javascript',
      encoding: Encoding.squashfs,
      entrypoint: 'dist/run.js',
      programRef:
        'd4a9f4abb451edb361504cc093e78e2d507fb3bb9244ffd746ababaf4c8537a9', // @note: token program
    }
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
    protected programManager: ProgramManager,
  ) {}

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

    const NETWORKS_CONFIG = newIndexer.networks.reduce((ac, cu) => {
      ac[this.getBlockchainEnvName(cu.id, 'INDEX_LOGS')] = 'true'
      ac[this.getBlockchainEnvName(cu.id, 'INDEX_BLOCKS')] = 'false'
      ac[this.getBlockchainEnvName(cu.id, 'INDEX_TRANSACTIONS')] = 'false'
      ac[this.getBlockchainEnvName(cu.id, 'RPC')] = cu.rpcUrl
      ac[this.getBlockchainEnvName(cu.id, 'EXPLORER_URL')] = cu.abiUrl
        ? cu.abiUrl
        : BlockchainDefaultABIUrl[cu.blockchain]
      return ac
    }, {} as Record<string, string>)

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
    newIndexer = IndexerManager.addSchema.parse(newIndexer)

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
}