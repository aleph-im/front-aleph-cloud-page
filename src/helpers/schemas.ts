import { z } from 'zod'
import { AddDomainTarget, EntityType, VolumeType } from './constants'

export const requiredString = z
  .string()
  .trim()
  .min(1, { message: 'Required field' })

export const optionalString = z.string().trim().optional()

export const messageHash = requiredString.regex(/^[0-9a-f]{64}$/)

// @note: Different options to validate a domain
// /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
// /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/
// /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/

const domainName = requiredString.regex(
  /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/,
  { message: 'Invalid domain format' },
)

// z.instanceof(File),
const volumeFile = z
  .custom<File>((val) => val instanceof File, 'Required file')
  .refine(
    (file) => {
      return (
        (file.type === 'application/zip' && file.name.endsWith('.zip')) ||
        (file.type === '' && file.name.endsWith('.sqsh'))
      )
    },
    { message: 'only .zip and .sqsh formats are valid' },
  )
  .refine((file) => file.size > 0, {
    message: 'File size should be greater than 0',
  })

const codeFile = z
  .custom<File>((val) => val instanceof File, 'Required file')
  .refine(
    (file) => file.type === 'application/zip' && file.name.endsWith('.zip'),
    { message: 'only .zip and .sqsh formats are valid' },
  )
  .refine((file) => file.size > 0, {
    message: 'File size should be greater than 0',
  })

// SSH KEYS

export const sshKeySchema = z.object({
  key: requiredString,
  label: optionalString,
})

export const sshKeysSchema = z.array(sshKeySchema)

// DOMAINS

export const domainSchema = z.object({
  name: domainName,
  target: z.enum([AddDomainTarget.Program, AddDomainTarget.IPFS]),
  programType: z.enum([EntityType.Instance, EntityType.Program]),
  ref: messageHash,
})

export const domainsSchema = z.array(domainSchema)

// VOLUME

export const newIsolatedVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.New),
  file: volumeFile,
})

export const newIsolatedVolumesSchema = z.array(newIsolatedVolumeSchema)

// VOLUMES

export const newVolumeSchema = newIsolatedVolumeSchema.extend({
  mountPath: requiredString,
  useLatest: z.boolean(),
})

// EXECUTION

export const existingVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.Existing),
  refHash: messageHash,
  mountPath: requiredString,
  useLatest: z.boolean(),
})

export const persistentVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.Persistent),
  name: requiredString,
  mountPath: requiredString,
  size: z.number(),
})

export const addVolumeSchema = z.discriminatedUnion('volumeType', [
  newVolumeSchema,
  existingVolumeSchema,
  persistentVolumeSchema,
])

export const addVolumesSchema = z.array(addVolumeSchema)

export const addDomainSchema = z.object({
  name: domainName,
})

export const addDomainsSchema = z.array(addDomainSchema)

export const addEnvVarSchema = z.object({
  name: requiredString,
  value: requiredString,
})

export const addEnvVarsSchema = z.array(addEnvVarSchema)

export const defaultCode = z.object({
  lang: z.enum(['python', 'javascript']),
})

export const addCodeSchema = z.discriminatedUnion('type', [
  defaultCode.extend({
    type: z.literal('file'),
    file: codeFile,
  }),
  defaultCode.extend({
    type: z.literal('text'),
    text: requiredString,
  }),
])

export const addNameAndTagsSchema = z.object({
  name: requiredString,
  tags: z.array(z.string()).optional(),
})

export const addSSHKeySchema = sshKeySchema.extend({
  isSelected: z.boolean(),
})

export const addSSHKeysSchema = z.array(addSSHKeySchema)

export const isPersistentSchema = z.coerce.boolean()

export const functionRuntimeSchema = z
  .object({
    id: messageHash,
    custom: messageHash.optional(),
  })
  .refine(({ id, custom }) => id !== 'custom' || !!custom, {
    message: 'Custom hash is required',
    path: ['custom'],
  })

export const instanceImageSchema = messageHash

export const addSpecsSchema = z.object({
  cpu: z.number().gt(0).lte(12).multipleOf(2),
  ram: z.number().gt(0),
  storage: z.number().gt(0),
})

// FUNCTION

export const functionSchema = z.object({
  code: addCodeSchema,
  nameAndTags: addNameAndTagsSchema,
  runtime: functionRuntimeSchema,
  isPersistent: isPersistentSchema,
  volumes: addVolumesSchema,
  specs: addSpecsSchema,
  envVars: addEnvVarsSchema,
  domains: addDomainsSchema,
})

// INSTANCE

export const instanceSchema = z.object({
  image: instanceImageSchema,
  nameAndTags: addNameAndTagsSchema,
  volumes: addVolumesSchema,
  specs: addSpecsSchema,
  envVars: addEnvVarsSchema,
  sshKeys: addSSHKeysSchema,
  domains: addDomainsSchema,
})
