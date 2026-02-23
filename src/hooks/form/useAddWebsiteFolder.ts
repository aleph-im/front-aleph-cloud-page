import { useEffect, useRef, useState } from 'react'
import { FileManager } from '@/domain/file'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
import { ipfsCIDSchema } from '@/helpers/schemas/base'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'

export type WebsiteFolderField = {
  folder?: File[]
  cid?: string
}

export const defaultVolume: WebsiteFolderField = {}

export type UseAddWebsiteFolderProps = {
  name?: string
  index?: number
  control: Control
  onRemove?: () => void
  defaultValue?: WebsiteFolderField
}

export type UseAddWebsiteFolderReturn = {
  folderCtrl: UseControllerReturn<any, any>
  cidCtrl: UseControllerReturn<any, any>
  isUploading: boolean
  uploadProgress: number
  uploadError: string | null
  handleRemove?: () => void
  handleCopyCID: () => void
}

const isCidFile = (folder: File | File[]): string | undefined => {
  folder = Array.isArray(folder) ? folder : [folder]
  const [file] = folder

  // Only match v0 CIDs
  if (!file) return

  try {
    ipfsCIDSchema.parse(file.name)
    return file.name
  } catch (e) {}
}

export function useAddWebsiteFolderProps({
  name = 'website',
  index,
  control,
  defaultValue,
  onRemove: handleRemove,
}: UseAddWebsiteFolderProps): UseAddWebsiteFolderReturn {
  const isStandAlone = index === undefined
  const n = isStandAlone ? name : `${name}.${index}`

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const lastUploadedFolderRef = useRef<File[] | null>(null)

  const folderCtrl = useController({
    control,
    name: `${n}.folder`,
    defaultValue: defaultValue?.folder,
  })
  const cidCtrl = useController({
    control,
    name: `${n}.cid`,
    defaultValue: defaultValue?.cid,
  })

  const { value: folder } = folderCtrl.field
  const setCid = cidCtrl.field.onChange

  useEffect(() => {
    async function uploadToIPFS() {
      // If folder is cleared, reset everything
      if (!folder) {
        setCid(undefined)
        setUploadError(null)
        setUploadProgress(0)
        lastUploadedFolderRef.current = null
        return
      }

      // Check if it's already a CID file (no upload needed)
      const existingCid = isCidFile(folder)
      if (existingCid) {
        setCid(existingCid)
        return
      }

      // Skip if we already uploaded this exact folder
      if (lastUploadedFolderRef.current === folder) return
      lastUploadedFolderRef.current = folder

      setIsUploading(true)
      setUploadProgress(0)
      setUploadError(null)

      try {
        const cid = await FileManager.uploadFolder(folder, setUploadProgress)
        if (cid) {
          setCid(cid)
        } else {
          setUploadError('Failed to get IPFS CID')
        }
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Upload failed')
      } finally {
        setIsUploading(false)
      }
    }

    uploadToIPFS()
  }, [folder, setCid])

  const handleCopyCID = useCopyToClipboardAndNotify(cidCtrl.field.value)

  return {
    folderCtrl,
    cidCtrl,
    isUploading,
    uploadProgress,
    uploadError,
    handleRemove,
    handleCopyCID,
  }
}
