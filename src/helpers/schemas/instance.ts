import { z } from 'zod'
import { VolumeManager, VolumeType } from '@/domain/volume'
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
import { NodeManager } from '@/domain/node'

// CRN STREAM

export const gpuDeviceSchema = z.object({
  vendor: z.string(),
  model: z.string(),
  device_name: z.string(),
  device_class: z.string(),
  device_id: z.string(),
  compatible: z.boolean(),
})

export const nodeSpecsSchema = z.object({
  hash: z.string(),
  name: z.string().optional(),
  owner: z.string(),
  reward: z.string(),
  locked: z.boolean(),
  time: z.number(),
  score: z.number(),
  score_updated: z.boolean(),
  decentralization: z.number(),
  performance: z.number(),
  status: z.enum(['active', 'waiting', 'linked']),
  parent: z.string().nullable(),
  type: z.string(),
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
      features: z.array(z.string()).optional(),
    }),
  }),
  active: z.boolean(),
  gpu: z
    .object({
      devices: z.array(gpuDeviceSchema).optional(),
      available_devices: z.array(gpuDeviceSchema).optional(),
    })
    .optional(),
  compatible_gpus: z.array(gpuDeviceSchema).optional(),
  compatible_available_gpus: z.array(gpuDeviceSchema).optional(),
  gpu_support: z.boolean().optional(),
  confidential_support: z.boolean().optional(),
  qemu_support: z.boolean().optional(),
  ipv6_check: z
    .object({
      host: z.boolean(),
      vm: z.boolean(),
    })
    .optional(),
  version: z.string().optional(),
  selectedGpu: gpuDeviceSchema.optional(),
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
    systemVolumeSize: z.number().optional(),
    payment: z.any().optional(),
    node: z.any().optional(),
    termsAndConditions: z.string().optional(),
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
  .refine(
    ({ nodeSpecs, specs }) => {
      return NodeManager.validateMinNodeSpecs(specs, nodeSpecs)
    },
    {
      message: 'Insufficient node specs',
      path: ['specs'],
    },
  )
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
