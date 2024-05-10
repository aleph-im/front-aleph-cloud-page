import { z } from 'zod'
import {
  domainNameSchema,
  ipfsCIDSchema,
  messageHashSchema,
  targetSchema,
} from './base'

// DOMAINS
export const domainSchema = z.object({
  name: domainNameSchema,
  target: targetSchema,
  ref: messageHashSchema.or(ipfsCIDSchema),
})

export const domainsSchema = z.array(domainSchema)
