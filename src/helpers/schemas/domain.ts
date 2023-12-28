import { z } from 'zod'
import { domainNameSchema, messageHashSchema, programTypeSchema } from './base'
import { AddDomainTarget } from '../constants'

// DOMAINS

export const domainSchema = z.object({
  name: domainNameSchema,
  target: z.enum([
    AddDomainTarget.IPFS,
    AddDomainTarget.Program,
    AddDomainTarget.Instance,
  ]),
  programType: programTypeSchema,
  ref: messageHashSchema,
})

export const domainsSchema = z.array(domainSchema)
