import { z } from 'zod'
import { ethereumAddressSchema, requiredStringSchema } from './base'
import { MessageType } from '@aleph-sdk/message'

const messageTypeSchema = z.nativeEnum(MessageType)

const baseMessageTypePermissionsSchema = z.object({
  type: messageTypeSchema,
  authorized: z.boolean(),
})

const postPermissionsSchema = z.object({
  type: z.literal(MessageType.post),
  postTypes: z.array(z.string()),
  authorized: z.boolean(),
})

const aggregatePermissionsSchema = z.object({
  type: z.literal(MessageType.aggregate),
  aggregateKeys: z.array(z.string()),
  authorized: z.boolean(),
})

const messageTypePermissionsSchema = z.union([
  postPermissionsSchema,
  aggregatePermissionsSchema,
  baseMessageTypePermissionsSchema,
])

const permissionsConfigSchema = z.object({
  channels: z.array(z.string()),
  messageTypes: z.array(messageTypePermissionsSchema),
})

export const newPermissionSchema = z.object({
  address: ethereumAddressSchema,
  alias: requiredStringSchema,
  permissions: permissionsConfigSchema,
})

export const accountPermissionSchema = z.object({
  id: ethereumAddressSchema,
  alias: z.string().optional(),
  channels: z.array(z.string()),
  messageTypes: z.array(messageTypePermissionsSchema),
  revoked: z.boolean().optional(),
})

export const accountPermissionsSchema = z.array(accountPermissionSchema)
