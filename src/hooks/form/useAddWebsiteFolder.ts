import { useEffect, useState } from 'react'
import { humanReadableSize } from '@/helpers/utils'
import { FileManager } from '@/domain/file'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
import { ipfsCIDSchema } from '@/helpers/schemas/base'
//import { useIPFS } from '@/contexts/helia'

export type WebsiteFolderField = {
  folder?: FileList
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  folderCtrl: UseControllerReturn<any, any>
  cidCtrl: UseControllerReturn<any, any>
  folderSize: string
  handleRemove?: () => void
}

const isCidFile = (folder: FileList): string | undefined => {
  // Only match v0 CIDs
  if (folder.length === 1) {
    try {
      ipfsCIDSchema.parse(folder[0].name)
      return folder[0].name
    } catch (e) {}
  }
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
  const [folderSize, setFolderSize] = useState<string>('')

  useEffect(() => {
    async function load() {
      if (folder) {
        const size = await FileManager.getFolderSize(folder)
        const hSize = humanReadableSize(size, 'MiB')
        setFolderSize(hSize)
        const cid =
          isCidFile(folder) || (await FileManager.uploadFolder(folder))
        if (cid) cidCtrl.field.onChange(cid)
      } else if (folderSize) {
        setFolderSize('')
        cidCtrl.field.onChange('')
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder])

  return {
    folderCtrl,
    cidCtrl,
    folderSize,
    handleRemove,
  }
}
