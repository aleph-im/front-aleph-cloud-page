import { z } from 'zod'
import { addDomainsSchema, addNameAndTagsSchema } from './execution'
import { WebsiteFrameworkId } from '@/domain/website'

export const websiteFrameworkSchema = z.enum([
  WebsiteFrameworkId.none,
  //WebsiteFrameworkId.react,
  WebsiteFrameworkId.nextjs,
  /* WebsiteFrameworkId.gatsby,
  WebsiteFrameworkId.svelte,
  WebsiteFrameworkId.vue,
  WebsiteFrameworkId.nuxt,
  WebsiteFrameworkId.angular, */
])

export const websiteFolderSchema = z
  .custom<FileList>((val) => val instanceof FileList, 'Required folder')
  .refine((folder) => folder && folder.length > 0, {
    message: 'Folder must contain at least one file',
  })

export const websiteSchema = z
  .object({
    // paymentMethod: paymentMethodSchema,
    framework: websiteFrameworkSchema,
    folder: websiteFolderSchema,
    domains: addDomainsSchema.optional(),
  })
  .merge(addNameAndTagsSchema)
