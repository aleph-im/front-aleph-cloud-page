import { z } from 'zod'
import { requiredStringSchema, optionalStringSchema } from './base'

// SSH KEYS

export const sshKeySchema = z.object({
  key: requiredStringSchema,
  label: optionalStringSchema,
})

export const sshKeysSchema = z.array(sshKeySchema)
