import { z } from 'zod'
import { AddDomainTarget, EntityType, VolumeType } from './constants'
import { convertByteUnits } from './utils'

export const requiredString = z
  .string()
  .trim()
  .min(1, { message: 'Required field' })

export const optionalString = z.string().trim().optional()

export const messageHash = requiredString.regex(/^[0-9a-f]{64}$/, {
  message: 'Invalid hash',
})

// @note: Different options to validate a domain
// /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
// /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/
// /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/

const domainName = requiredString.regex(
  /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/,
  { message: 'Invalid domain format' },
)

const linuxPath = requiredString.regex(/^(\/[^\/ ]*)+\/?$/, {
  message: 'Invalid path',
})

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

const programType = z.enum([EntityType.Instance, EntityType.Program])

// SSH KEYS

export const sshKeySchema = z.object({
  key: requiredString,
  label: optionalString,
})

export const sshKeysSchema = z.array(sshKeySchema)

// DOMAINS

export const domainSchema = z.object({
  name: domainName,
  target: z.enum([
    AddDomainTarget.IPFS,
    AddDomainTarget.Program,
    AddDomainTarget.Instance,
  ]),
  programType,
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
  mountPath: linuxPath,
  useLatest: z.coerce.boolean(),
})

// EXECUTION

export const existingVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.Existing),
  refHash: messageHash,
  mountPath: linuxPath,
  useLatest: z.coerce.boolean(),
})

export const persistentVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.Persistent),
  name: requiredString,
  mountPath: linuxPath,
  size: z.number().gt(0),
})

export const addVolumeSchema = z.discriminatedUnion('volumeType', [
  newVolumeSchema,
  existingVolumeSchema,
  persistentVolumeSchema,
])

export const addVolumesSchema = z.array(addVolumeSchema)

export const addDomainSchema = domainSchema.extend({
  // @note: This is calculated after publishing the instance
  ref: optionalString,
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

export const functionRuntimeSchema = z
  .object({
    id: z.union([messageHash, z.literal('custom')]),
    custom: optionalString,
  })
  .superRefine(({ id, custom }, { addIssue }) => {
    if (id !== 'custom') return true
    const result = messageHash.safeParse(custom, { path: ['custom'] })

    if (!result.success) {
      result.error.issues.forEach((issue) => addIssue(issue))
    }
  })

export const instanceImageSchema = messageHash

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

export const functionSchema = z
  .object({
    code: addCodeSchema,
    runtime: functionRuntimeSchema,
    isPersistent: isPersistentSchema,
    volumes: addVolumesSchema,
    specs: addSpecsSchema,
    envVars: addEnvVarsSchema,
    domains: addDomainsSchema,
  })
  .merge(addNameAndTagsSchema)

// INSTANCE

export const instanceSchema = z
  .object({
    image: instanceImageSchema,
    volumes: addVolumesSchema,
    specs: addSpecsSchema,
    envVars: addEnvVarsSchema,
    sshKeys: addSSHKeysSchema,
    domains: addDomainsSchema,
  })
  .merge(addNameAndTagsSchema)
