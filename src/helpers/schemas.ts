import { z } from 'zod'
import {
  AddDomainTarget,
  EntityType,
  IndexerBlockchain,
  VolumeType,
} from './constants'
import { convertByteUnits } from './utils'
import { Encoding } from 'aleph-sdk-ts/dist/messages/program/programModel'
import { FunctionLangId } from '@/domain/lang'

export const requiredStringSchema = z
  .string()
  .trim()
  .min(1, { message: 'Required field' })

function optionalString(schema: z.ZodString) {
  return schema.optional().or(z.literal(''))
}

export const optionalStringSchema = z.string().trim().optional()

export const messageHashSchema = requiredStringSchema.regex(/^[0-9a-f]{64}$/, {
  message: 'Invalid hash format',
})

// @note: Different options to validate a domain
// /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
// /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/
// /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/

export const domainNameSchema = requiredStringSchema.regex(
  /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/,
  { message: 'Invalid domain format' },
)

export const urlSchema = requiredStringSchema.regex(
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  { message: 'Invalid url format' },
)

export const linuxPathSchema = requiredStringSchema.regex(/^(\/[^\/ ]*)+\/?$/, {
  message: 'Invalid path format',
})

export const ethereumAddressSchema = requiredStringSchema.regex(
  /^0x[a-fA-F0-9]{40}$/,
  { message: 'Invalid address format' },
)

export const tokenSupplySchema = requiredStringSchema.regex(/^[0-9]+$/, {
  message: 'Invalid supply format',
})

// z.instanceof(File),
export const volumeFileSchema = z
  .custom<File>((val) => val instanceof File, 'Required file')
  .refine(
    (file) => {
      return (
        (file.type === 'application/zip' && file.name.endsWith('.zip')) ||
        file.name.endsWith('.sqsh') ||
        file.name.endsWith('.squashfs')
      )
    },
    { message: 'only .zip, .sqsh and .squashfs formats are valid' },
  )
  .refine((file) => file.size > 0, {
    message: 'File size should be greater than 0',
  })

export const codeFileSchema = z
  .custom<File>((val) => val instanceof File, 'Required file')
  .refine(
    (file) => {
      console.log(file)
      return (
        (file.type === 'application/zip' && file.name.endsWith('.zip')) ||
        file.name.endsWith('.sqsh') ||
        file.name.endsWith('.squashfs')
      )
    },
    { message: 'only .zip, .sqsh and .squashfs formats are valid' },
  )
  .refine((file) => file.size > 0, {
    message: 'File size should be greater than 0',
  })

export const ipfsCIDSchema = requiredStringSchema.regex(
  /^Qm[1-9A-Za-z]{44}[^OIl]$/,
  { message: 'Invalid IPFS CID hash' },
)

export const programTypeSchema = z.enum([
  EntityType.Instance,
  EntityType.Program,
])

export const indexerBlockchainSchema = z.enum([
  IndexerBlockchain.Ethereum,
  IndexerBlockchain.Bsc,
])

export const metadataSchema = z.record(requiredStringSchema, z.unknown())

// SSH KEYS

export const sshKeySchema = z.object({
  key: requiredStringSchema,
  label: optionalStringSchema,
})

export const sshKeysSchema = z.array(sshKeySchema)

// DOMAINS

export const domainSchema = z.object({
  name: domainNameSchema,
  target: z.enum([
    AddDomainTarget.IPFS,
    AddDomainTarget.Program,
    AddDomainTarget.Instance,
  ]),
  programType: programTypeSchema,
  ref: messageHashSchema,
})

export const domainsSchema = z.array(domainSchema)

// VOLUME

export const newIsolatedVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.New),
  file: volumeFileSchema,
})

export const newIsolatedVolumesSchema = z.array(newIsolatedVolumeSchema)

// VOLUMES

export const newVolumeSchema = newIsolatedVolumeSchema.extend({
  mountPath: linuxPathSchema,
  useLatest: z.coerce.boolean(),
  isFake: z.boolean().optional(),
})

// EXECUTION

export const existingVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.Existing),
  refHash: messageHashSchema,
  mountPath: linuxPathSchema,
  useLatest: z.coerce.boolean(),
  isFake: z.boolean().optional(),
})

export const persistentVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.Persistent),
  name: requiredStringSchema,
  mountPath: linuxPathSchema,
  size: z.number().gt(0),
  isFake: z.boolean().optional(),
})

export const addVolumeSchema = z.discriminatedUnion('volumeType', [
  newVolumeSchema,
  existingVolumeSchema,
  persistentVolumeSchema,
])

export const addVolumesSchema = z.array(addVolumeSchema)

export const addDomainSchema = domainSchema.extend({
  // @note: This is calculated after publishing the instance
  ref: optionalStringSchema,
})

export const addDomainsSchema = z.array(addDomainSchema)

export const addEnvVarSchema = z.object({
  name: requiredStringSchema,
  value: requiredStringSchema,
})

export const addEnvVarsSchema = z.array(addEnvVarSchema)

export const defaultCode = z.object({
  lang: z.enum([
    FunctionLangId.Python,
    FunctionLangId.Node,
    FunctionLangId.Other,
  ]),
})

export const addCodeSchema = z.discriminatedUnion('type', [
  defaultCode.extend({
    type: z.literal('file'),
    file: codeFileSchema,
    entrypoint: requiredStringSchema,
  }),
  defaultCode.extend({
    type: z.literal('text'),
    text: requiredStringSchema,
  }),
  defaultCode.extend({
    type: z.literal('ref'),
    encoding: z.enum([Encoding.squashfs, Encoding.zip, Encoding.plain]),
    programRef: messageHashSchema,
    entrypoint: requiredStringSchema,
  }),
])

export const addNameAndTagsSchema = z.object({
  name: requiredStringSchema,
  tags: z.array(z.string().trim()).optional(),
})

export const addSSHKeySchema = sshKeySchema.extend({
  isSelected: z.boolean(),
  isNew: z.boolean(),
})

export const addSSHKeysSchema = z
  .array(addSSHKeySchema)
  .refine((val) => val.some((key) => key.isSelected), {
    message: 'At least one ssh key should be add and selected',
    path: ['0.isSelected'],
  })

export const isPersistentSchema = z.coerce.boolean()

export const instanceImageSchema = messageHashSchema

export const addSpecsSchema = z
  .object({
    cpu: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(4),
      z.literal(6),
      z.literal(8),
      z.literal(12),
    ]),
    ram: z.number().gt(0),
    storage: z.number().gt(0),
  })
  .refine(
    ({ cpu, ram }) =>
      ram === convertByteUnits(cpu * 2, { from: 'GiB', to: 'MiB' }),
    { message: 'Invalid specs' },
  )
  .refine(
    ({ cpu, storage }) =>
      storage === convertByteUnits(cpu * 20, { from: 'GiB', to: 'MiB' }) ||
      storage === convertByteUnits(cpu * 2, { from: 'GiB', to: 'MiB' }),
    { message: 'Invalid specs' },
  )

// FUNCTION

export const addRuntimeSchema = optionalString(messageHashSchema)

export const functionSchema = z
  .object({
    code: addCodeSchema,
    isPersistent: isPersistentSchema,
    specs: addSpecsSchema,
    runtime: addRuntimeSchema.optional(),
    volumes: addVolumesSchema.optional(),
    envVars: addEnvVarsSchema.optional(),
    domains: addDomainsSchema.optional(),
    metadata: metadataSchema.optional(),
  })
  .merge(addNameAndTagsSchema)
  .refine(
    ({ code, runtime }) => !!runtime || code.lang !== FunctionLangId.Other,
    { message: 'Invalid function runtime', path: ['runtime'] },
  )

// INSTANCE

export const instanceSchema = z
  .object({
    image: instanceImageSchema,
    specs: addSpecsSchema,
    sshKeys: addSSHKeysSchema,
    volumes: addVolumesSchema.optional(),
    envVars: addEnvVarsSchema.optional(),
    domains: addDomainsSchema.optional(),
    metadata: metadataSchema.optional(),
  })
  .merge(addNameAndTagsSchema)

// INDEXER

export const indexerNetworkIdSchema = requiredStringSchema.regex(
  /^[0-9a-z-]+$/,
  { message: 'Network id should be provided in kebab-case-format' },
)

export const abiUrlSchema = urlSchema.includes('$ADDRESS', {
  message:
    'The url must contain the token "$ADDRESS" that will be replaced in runtime with token contract addresses',
})

export const indexerNetworkSchema = z.object({
  id: indexerNetworkIdSchema,
  blockchain: indexerBlockchainSchema,
  rpcUrl: urlSchema,
  abiUrl: optionalString(abiUrlSchema),
})

export const indexerNetworksSchema = z.array(indexerNetworkSchema)

export const IndexerTokenAccountSchema = z.object({
  network: requiredStringSchema,
  contract: ethereumAddressSchema,
  deployer: ethereumAddressSchema,
  supply: tokenSupplySchema,
  decimals: z.number().gte(0),
})

export const IndexerTokenAccountsSchema = z.array(IndexerTokenAccountSchema)

export const indexerSchema = z
  .object({
    networks: indexerNetworksSchema.min(1),
    accounts: IndexerTokenAccountsSchema.min(1),
  })
  .merge(addNameAndTagsSchema)
  .superRefine(async ({ networks, accounts }, ctx) => {
    for (const [i, account] of Object.entries(accounts)) {
      const j = networks.findIndex((network) => network.id === account.network)
      const accountNetwork = networks[j]

      if (!accountNetwork) {
        ctx.addIssue({
          fatal: true,
          code: z.ZodIssueCode.custom,
          message:
            'Invalid network. It should be one of the defined blockchain networks ids',
          path: [`accounts.${i}.network`],
        })

        return z.NEVER
      }

      if (!account.contract) return z.NEVER
      if (!accountNetwork.abiUrl) return z.NEVER
      if (!accountNetwork.abiUrl.includes('$ADDRESS')) return z.NEVER

      const abiAddress = accountNetwork.abiUrl.replace(
        '$ADDRESS',
        account.contract,
      )

      const query = await fetch(abiAddress)
      const response = await query.json()

      let abi = undefined

      try {
        abi = JSON.parse(response?.result)
      } catch {
        // @note: Skip getting stuck in rate limit scenarios
        if (response?.result.includes('rate limit')) return z.NEVER
      }

      if (!abi) {
        ctx.addIssue({
          fatal: true,
          code: z.ZodIssueCode.custom,
          message:
            'Invalid ABI url. It should return a valid ABI json inside response.body.result field',
          path: [`networks.${j}.abiUrl`],
        })

        return z.NEVER
      }
    }
  })
