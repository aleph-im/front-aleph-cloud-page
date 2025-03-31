import { z } from 'zod'
import { VolumeType } from '../constants'
import {
  linuxPathSchema,
  messageHashSchema,
  optionalStringSchema,
  requiredStringSchema,
  requiredRestrictedStringSchema,
  requiredVolumeNameSchema,
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
  name: requiredVolumeNameSchema,
  mountPath: linuxPathSchema,
  size: z.number().gt(0),
})

export const addVolumeSchema = z.discriminatedUnion('volumeType', [
  newVolumeSchema,
  existingVolumeSchema,
  persistentVolumeSchema,
])

export const addVolumesSchema = z
  .array(addVolumeSchema)
  .superRefine((volumes, ctx) => {
    // Store names and mount paths to check for duplicates
    const names = new Set<string>()
    const mountPaths = new Set<string>()

    // Add system volume mount path (always "/" root) to reserved paths
    mountPaths.add('/')

    // Check each volume
    volumes.forEach((vol, idx) => {
      // Only check volumes with names (persistent volumes)
      if (vol.volumeType === VolumeType.Persistent && vol.name) {
        // Check for duplicate name
        if (names.has(vol.name)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate volume name: "${vol.name}" - Volume names must be unique`,
            path: [idx, 'name'],
          })
        } else {
          names.add(vol.name)
        }
      }

      // Check for duplicate mount path
      if (vol.mountPath) {
        if (mountPaths.has(vol.mountPath)) {
          // Provide a specific message if trying to use the system volume mount path
          const isSystemVolumeConflict = vol.mountPath === '/'
          const message = isSystemVolumeConflict
            ? `Mount path "/" is reserved for the system volume - Choose a different path`
            : `Duplicate mount path: "${vol.mountPath}" - Mount paths must be unique`

          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message,
            path: [idx, 'mountPath'],
          })
        } else {
          mountPaths.add(vol.mountPath)
        }
      }
    })
  })

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
