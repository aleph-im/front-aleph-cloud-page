import { z } from 'zod'
import { addDomainsSchema, addRestrictedNameAndTagsSchema } from './execution'
import { WebsiteFrameworkId } from '@/domain/website'
import {
  blockchainSchema,
  ipfsCIDSchema,
  paymentMethodSchema,
  domainNameSchema,
} from './base'

export const websiteFrameworkSchema = z.enum([
  WebsiteFrameworkId.none,
  WebsiteFrameworkId.nextjs,
  WebsiteFrameworkId.react,
  WebsiteFrameworkId.vue,
  /* WebsiteFrameworkId.gatsby,
  WebsiteFrameworkId.svelte,
  WebsiteFrameworkId.nuxt,
  WebsiteFrameworkId.angular */
])

export const websiteFolderSchema = z
  .custom<File[]>(
    (val) =>
      Array.isArray(val)
        ? val.every((v) => v instanceof File)
        : val instanceof File,
    'Required folder',
  )
  .refine((folder) => folder && folder.length > 0, {
    message: 'Folder must contain at least one file',
  })

export const websiteDataSchema = z.object({
  folder: websiteFolderSchema,
  cid: ipfsCIDSchema,
})

export { ipfsCIDSchema }

export const websitePaymentSchema = z.object({
  type: paymentMethodSchema,
  chain: blockchainSchema,
})

export const historySchema = z.record(ipfsCIDSchema)

export const ensSchema = z.array(domainNameSchema)

export const websiteSchema = z
  .object({
    framework: websiteFrameworkSchema,
    payment: websitePaymentSchema,
    website: websiteDataSchema,
    domains: addDomainsSchema.optional(),
    ens: ensSchema.optional(),
  })
  .merge(addRestrictedNameAndTagsSchema)
