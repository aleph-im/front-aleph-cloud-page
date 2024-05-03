import { z } from 'zod'
import { addDomainsSchema, addNameAndTagsSchema } from './execution'
import { WebsiteFrameworkId } from '@/domain/website'
import { ipfsCIDSchema, paymentMethodSchema } from './base'

export const websiteFrameworkSchema = z.enum([
  WebsiteFrameworkId.none,
  WebsiteFrameworkId.nextjs,
  /* WebsiteFrameworkId.react,
  WebsiteFrameworkId.gatsby,
  WebsiteFrameworkId.svelte,
  WebsiteFrameworkId.vue,
  WebsiteFrameworkId.nuxt,
  WebsiteFrameworkId.angular */
])

export const websiteFolderSchema = z
  .custom<FileList>((val) => val instanceof FileList, 'Required folder')
  .refine((folder) => folder && folder.length > 0, {
    message: 'Folder must contain at least one file',
  })

export const websiteDataSchema = z.object({
  folder: websiteFolderSchema,
  cid: ipfsCIDSchema,
})

export const websiteSchema = z
  .object({
    framework: websiteFrameworkSchema,
    website: websiteDataSchema,
    domains: addDomainsSchema.optional(),
    paymentMethod: paymentMethodSchema,
  })
  .merge(addNameAndTagsSchema)
