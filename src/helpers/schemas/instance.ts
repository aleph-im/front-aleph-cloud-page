import { z } from 'zod'
import { VolumeManager, VolumeType } from '@/domain/volume'
import { validateMinNodeSpecs } from '@/hooks/form/useSelectInstanceSpecs'
import { messageHashSchema, paymentMethodSchema } from './base'
import {
  addSpecsSchema,
  addVolumesSchema,
  addEnvVarsSchema,
  addDomainsSchema,
  metadataSchema,
  addNameAndTagsSchema,
} from './execution'
import { sshKeySchema } from './ssh'
import { humanReadableSize } from '../utils'

// CRN STREAM

export const nodeSpecsSchema = z.object({
  hash: z.string(),
  name: z.string().optional(),
  cpu: z.object({
    count: z.number(),
    load_average: z.object({
      load1: z.number(),
      load5: z.number(),
      load15: z.number(),
    }),
    core_frequencies: z.object({
      min: z.number(),
      max: z.number(),
    }),
  }),
  mem: z.object({
    total_kB: z.number(),
    available_kB: z.number(),
  }),
  disk: z.object({
    total_kB: z.number(),
    available_kB: z.number(),
  }),
  period: z.object({
    start_timestamp: z.string(),
    duration_seconds: z.number(),
  }),
  properties: z.object({
    cpu: z.object({
      architecture: z.string(),
      vendor: z.string(),
    }),
  }),
  active: z.boolean(),
})

// SSH

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

// STREAM DURATION

export const streamDurationUnitSchema = z.enum(['h', 'd', 'm', 'y'])

export const streamDurationSchema = z.object({
  duration: z.coerce.number(),
  unit: streamDurationUnitSchema,
})

// INSTANCE

export const instanceImageSchema = messageHashSchema

export const instanceSchema = z
  .object({
    paymentMethod: paymentMethodSchema,
    image: instanceImageSchema,
    specs: addSpecsSchema,
    sshKeys: addSSHKeysSchema,
    volumes: addVolumesSchema.optional(),
    envVars: addEnvVarsSchema.optional(),
    domains: addDomainsSchema.optional(),
    metadata: metadataSchema.optional(),
    payment: z.any().optional(),
    node: z.any().optional(),
  })
  .merge(addNameAndTagsSchema)

export const instanceStreamSchema = instanceSchema
  .merge(
    z.object({
      nodeSpecs: nodeSpecsSchema,
      streamDuration: streamDurationSchema,
      streamCost: z.number(),
    }),
  )
  .refine(({ nodeSpecs, specs }) => validateMinNodeSpecs(specs, nodeSpecs), {
    message: 'Insufficient node specs',
    path: ['specs'],
  })
  .superRefine(async ({ nodeSpecs, specs, volumes = [] }, ctx) => {
    let available = nodeSpecs.disk.available_kB / 1024

    for (const [i, volume] of Object.entries(volumes)) {
      const size = await VolumeManager.getVolumeSize(volume)
      available -= size

      if (available < 0) {
        const path =
          volume.volumeType === VolumeType.Persistent
            ? [`volumes.${i}.size`]
            : volume.volumeType === VolumeType.Existing
            ? [`volumes.${i}.refHash`]
            : [`volumes.${i}.mountPath`]

        ctx.addIssue({
          fatal: true,
          code: z.ZodIssueCode.custom,
          message: `${
            nodeSpecs.name || 'The selected CRN'
          } supports a maximum of ${humanReadableSize(
            nodeSpecs.disk.available_kB / 1024 - specs.storage,
            'MiB',
          )} of additional storage.`,
          path,
        })

        return z.NEVER
      }
    }
  })
