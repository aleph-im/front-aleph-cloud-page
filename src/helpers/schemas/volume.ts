import { z } from 'zod'
import { VolumeType } from '../constants'
import { volumeFileSchema } from './base'

// VOLUME

export const newIsolatedVolumeSchema = z.object({
  volumeType: z.literal(VolumeType.New),
  file: volumeFileSchema,
})

export const newIsolatedVolumesSchema = z.array(newIsolatedVolumeSchema)
