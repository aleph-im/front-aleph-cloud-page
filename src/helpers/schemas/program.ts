import { z } from 'zod'
import { FunctionLangId } from '@/domain/lang'
import { Encoding } from '@aleph-sdk/message'
import {
  codeFileSchema,
  requiredStringSchema,
  messageHashSchema,
  optionalString,
  paymentMethodSchema,
} from './base'
import {
  addSpecsSchema,
  addVolumesSchema,
  addEnvVarsSchema,
  addDomainsSchema,
  metadataSchema,
  addNameAndTagsSchema,
} from './execution'

// CODE

export const defaultCode = z.object({
  lang: z.enum([
    FunctionLangId.Python,
    FunctionLangId.Node,
    FunctionLangId.Other,
  ]),
})

export const addCodeSchema = z.discriminatedUnion('type', [
  defaultCode.extend({
    type: z.literal('file'),
    file: codeFileSchema,
    entrypoint: requiredStringSchema,
  }),
  defaultCode.extend({
    type: z.literal('text'),
    text: requiredStringSchema,
  }),
  defaultCode.extend({
    type: z.literal('ref'),
    encoding: z.enum([Encoding.squashfs, Encoding.zip, Encoding.plain]),
    programRef: messageHashSchema,
    entrypoint: requiredStringSchema,
  }),
])

// FUNCTION

export const isPersistentSchema = z.coerce.boolean()

export const addRuntimeSchema = optionalString(messageHashSchema)

export const functionSchema = z
  .object({
    paymentMethod: paymentMethodSchema,
    code: addCodeSchema,
    isPersistent: isPersistentSchema,
    specs: addSpecsSchema,
    runtime: addRuntimeSchema.optional(),
    volumes: addVolumesSchema.optional(),
    envVars: addEnvVarsSchema.optional(),
    domains: addDomainsSchema.optional(),
    metadata: metadataSchema.optional(),
    payment: z.any().optional(),
  })
  .merge(addNameAndTagsSchema)
  .refine(
    ({ code, runtime }) => !!runtime || code.lang !== FunctionLangId.Other,
    { message: 'Invalid function runtime', path: ['runtime'] },
  )
