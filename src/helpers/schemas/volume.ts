import { z } from 'zod'
import { VolumeType, VolumeUploadMode } from '../constants'
import { ipfsCIDSchema, volumeFileSchema } from './base'

// VOLUME

// 100 MiB limit for non-IPFS file uploads (in bytes)
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024

// Schema for file-based new volume with 100 MiB size limit
const volumeFileWithSizeLimitSchema = volumeFileSchema.refine(
  (file) => file.size <= MAX_FILE_SIZE_BYTES,
  { message: 'File size must be 100 MB or less. Use IPFS for larger files.' },
)

// Schema for file-based new volume (default mode) - single file upload
export const newFileVolumeBaseSchema = z.object({
  volumeType: z.literal(VolumeType.New),
  uploadMode: z
    .literal(VolumeUploadMode.File)
    .optional()
    .default(VolumeUploadMode.File),
  file: volumeFileWithSizeLimitSchema,
  cid: z.string().optional(),
})

// Schema for IPFS-based new volume - single file upload to IPFS
export const newIPFSVolumeBaseSchema = z.object({
  volumeType: z.literal(VolumeType.New),
  uploadMode: z.literal(VolumeUploadMode.IPFS),
  file: volumeFileSchema,
  cid: ipfsCIDSchema,
})

// Combined schema using union - validates based on uploadMode
export const newIsolatedVolumeSchema = z.union([
  newFileVolumeBaseSchema,
  newIPFSVolumeBaseSchema,
])

export const newIsolatedVolumesSchema = z.array(newIsolatedVolumeSchema)
