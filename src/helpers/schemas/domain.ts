import { z } from 'zod'
import {
  domainNameSchema,
  ipfsCIDSchema,
  messageHashSchema,
  programTypeSchema,
} from './base'
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
  ref: messageHashSchema.or(ipfsCIDSchema),
})

export const domainsSchema = z.array(domainSchema)
