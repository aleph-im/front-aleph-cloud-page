import { z } from 'zod'
import { domainNameSchema, messageHashSchema } from './base'
import { EntityDomainType } from '../constants'

// DOMAINS

export const domainSchema = z.object({
  name: domainNameSchema,
  target: z.enum([
    EntityDomainType.IPFS,
    EntityDomainType.Program,
    EntityDomainType.Instance,
  ]),
  ref: messageHashSchema,
})

export const domainsSchema = z.array(domainSchema)
