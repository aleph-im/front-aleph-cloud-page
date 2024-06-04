import { useEffect } from 'react'
import { FileManager } from '@/domain/file'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
import { ipfsCIDSchema } from '@/helpers/schemas/base'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'

export type WebsiteFolderField = {
  folder?: File
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
  //const { addFolder } = useIPFS()
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
  const { onChange } = cidCtrl.field

  useEffect(() => {
    async function load() {
      if (!folder) return

      const cid = isCidFile(folder) || (await FileManager.uploadFolder(folder))
      if (cid) onChange(cid)
    }

    load()
  }, [onChange, folder])

  const handleCopyCID = useCopyToClipboardAndNotify(cidCtrl.field.value)

  return {
    folderCtrl,
    cidCtrl,
    handleRemove,
    handleCopyCID,
  }
}
