import { z } from 'zod'
import { EntityDomainType, PaymentMethod } from '../constants'
import { BlockchainId } from '@/domain/connect/base'

export const requiredStringSchema = z
  .string()
  .trim()
  .min(1, { message: 'Required field' })

export const requiredRestrictedStringSchema = requiredStringSchema.regex(
  /^[a-zA-Z0-9_-]+$/,
  {
    message: 'Invalid name format (only a-zA-Z0-9_- are allowed)',
  },
)

export const requiredVolumeNameSchema = requiredStringSchema.regex(
  /^[a-zA-Z0-9_-]+$/,
  {
    message:
      'Volume name can only contain letters, numbers, underscores, and dashes',
  },
)

export function optionalString(schema: z.ZodString) {
  return schema.optional().or(z.literal(''))
}

export const optionalStringSchema = z.string().trim().optional()

// URL and address schemas
export const urlSchema = requiredStringSchema.regex(
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  { message: 'Invalid url format' },
)

export const multiaddressSchema = requiredStringSchema.regex(
  /^\/ip4\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/tcp\/[0-9]{1,4}\/p2p\/Qm[1-9A-HJ-NP-Za-km-z]{44}$/,
  { message: 'Invalid multiaddress format' },
)

export const ethereumAddressSchema = requiredStringSchema.regex(
  /^0x[a-fA-F0-9]{40}$/,
  { message: 'Invalid address format' },
)

export const messageHashSchema = requiredStringSchema.regex(/^[0-9a-f]{64}$/, {
  message: 'Invalid hash format',
})

// File schemas
export const fileSchema = z.custom<File>()

export const imgFileSchema = z
  .custom<File>((val) => val instanceof File, 'Invalid file type')
  .refine(
    (file) => {
      return (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/svg+xml'
      )
    },
    { message: 'only png, jpg, jpeg or svg formats are valid' },
  )
  .refine((file) => file.size > 0, {
    message: 'Image size size should be greater than 0',
  })

// Node schemas
export const newCCNSchema = z.object({
  name: requiredStringSchema,
  multiaddress: multiaddressSchema,
})

export const newCRNSchema = z.object({
  name: requiredStringSchema,
  address: urlSchema,
})

export const updateBaseNodeSchema = z.object({
  name: requiredStringSchema,
  hash: messageHashSchema,
  picture: optionalString(requiredStringSchema).or(imgFileSchema),
  banner: optionalString(requiredStringSchema).or(imgFileSchema),
  description: optionalString(requiredStringSchema),
  reward: optionalString(ethereumAddressSchema),
  authorized: optionalString(requiredStringSchema).or(
    z.array(ethereumAddressSchema).optional(),
  ),
  locked: z.boolean().optional(),
  registration_url: optionalString(urlSchema),
})

export const updateCCNSchema = updateBaseNodeSchema.extend({
  multiaddress: optionalString(multiaddressSchema),
  manager: optionalString(ethereumAddressSchema),
})

export const updateCRNSchema = updateBaseNodeSchema.extend({
  address: optionalString(urlSchema),
  stream_reward: optionalString(ethereumAddressSchema),
  terms_and_conditions: optionalStringSchema.or(fileSchema),
})

// @note: Different options to validate a domain
// /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
// /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/
// /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/

export const domainNameSchema = requiredStringSchema.regex(
  /^((?!-))(xn--)?([a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.)+((xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,}))$/,
  { message: 'Invalid domain format' },
)

export const linuxPathSchema = requiredStringSchema
  .regex(/^(\/[^\/ ]*)+\/?$/, {
    message: 'Invalid path format',
  })
  .regex(/^(\/[a-zA-Z0-9_-]*)+\/?$/, {
    message:
      'Mount path can only contain alphanumeric characters, underscores, and dashes',
  })

export const tokenSupplySchema = requiredStringSchema.regex(/^[0-9]+$/, {
  message: 'Invalid supply format',
})

// z.instanceof(File),
export const volumeFileSchema = z
  .custom<File>((val) => val instanceof File, 'Required file')
  .refine(
    (file) => {
      return (
        file.name.endsWith('.zip') ||
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
      return (
        file.name.endsWith('.zip') ||
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
  /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/,
  { message: 'Invalid IPFS CID hash' },
)

export const targetSchema = z.enum([
  EntityDomainType.Instance,
  EntityDomainType.Confidential,
  EntityDomainType.Program,
  EntityDomainType.IPFS,
])

export const paymentMethodSchema = z.enum([
  PaymentMethod.Hold,
  PaymentMethod.Stream,
  PaymentMethod.Credit,
])

export const blockchainSchema = z.enum([
  BlockchainId.ETH,
  BlockchainId.AVAX,
  BlockchainId.BASE,
  BlockchainId.SOL,
])
