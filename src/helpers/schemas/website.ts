import { z } from 'zod'
import { addDomainsSchema, addNameAndTagsSchema } from './execution'
import { WebsiteFrameworkId } from '@/domain/website'

export const websiteFrameworkSchema = z.enum([
  WebsiteFrameworkId.none,
  WebsiteFrameworkId.react,
  WebsiteFrameworkId.nextjs,
  WebsiteFrameworkId.gatsby,
  WebsiteFrameworkId.svelte,
  WebsiteFrameworkId.vue,
  WebsiteFrameworkId.nuxt,
  WebsiteFrameworkId.angular,
])

export const websiteFileSchema = z
  .custom<File>((val) => val instanceof File, 'Required file')
  .refine(
    (file) => {
      return file.type === 'application/zip' && file.name.endsWith('.zip')
    },
    { message: 'only .zip formats are valid' },
  )
  .refine((file) => file.size > 0, {
    message: 'File size should be greater than 0',
  })

// WEBSITE

export const websiteSchema = z
  .object({
    // paymentMethod: paymentMethodSchema,
    framework: websiteFrameworkSchema,
    file: websiteFileSchema,
    domains: addDomainsSchema.optional(),
  })
  .merge(addNameAndTagsSchema)
