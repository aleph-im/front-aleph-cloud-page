import { z } from 'zod'
import { EntityDomainType, PaymentMethod } from '../constants'

export const requiredStringSchema = z
  .string()
  .trim()
  .min(1, { message: 'Required field' })

export function optionalString(schema: z.ZodString) {
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
  /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/,
  { message: 'Invalid IPFS CID hash' },
)

export const targetSchema = z.enum([
  EntityDomainType.Instance,
  EntityDomainType.Program,
  EntityDomainType.IPFS,
])

export const paymentMethodSchema = z.enum([
  PaymentMethod.Hold,
  PaymentMethod.Stream,
])
