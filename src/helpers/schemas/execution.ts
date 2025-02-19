import { z } from 'zod'
import { VolumeType } from '../constants'
import {
  linuxPathSchema,
  messageHashSchema,
  optionalStringSchema,
  requiredStringSchema,
  requiredRestrictedStringSchema,
} from './base'
import { domainSchema } from './domain'
import { newIsolatedVolumeSchema } from './volume'

export const metadataSchema = z.record(requiredStringSchema, z.unknown())

// EXECUTION

export const newVolumeSchema = newIsolatedVolumeSchema.extend({
  mountPath: linuxPathSchema,
  useLatest: z.coerce.boolean(),
})

export const existingVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.Existing),
  refHash: messageHashSchema,
  mountPath: linuxPathSchema,
  useLatest: z.coerce.boolean(),
})

export const persistentVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.Persistent),
  name: requiredStringSchema,
  mountPath: linuxPathSchema,
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
  ref: optionalStringSchema,
})

export const addDomainsSchema = z.array(addDomainSchema)

export const addEnvVarSchema = z.object({
  name: requiredStringSchema,
  value: requiredStringSchema,
})

export const addEnvVarsSchema = z.array(addEnvVarSchema)

export const addNameAndTagsSchema = z.object({
  name: requiredStringSchema,
  tags: z.array(z.string().trim()).optional(),
})

export const addRestrictedNameAndTagsSchema = z.object({
  name: requiredRestrictedStringSchema,
  tags: z.array(z.string().trim()).optional(),
})

export const addSpecsSchema = z.object({
  cpu: z.number().gt(0),
  ram: z.number().gt(0),
  storage: z.number().gt(0),
})
// .refine(
//   ({ cpu, ram }) =>
//     ram === convertByteUnits(cpu * 2, { from: 'GiB', to: 'MiB' }),
//   { message: 'Invalid specs' },
// )
// .refine(
//   ({ cpu, storage }) =>
//     storage === convertByteUnits(cpu * 20, { from: 'GiB', to: 'MiB' }) ||
//     storage === convertByteUnits(cpu * 2, { from: 'GiB', to: 'MiB' }),
//   { message: 'Invalid specs' },
// )
