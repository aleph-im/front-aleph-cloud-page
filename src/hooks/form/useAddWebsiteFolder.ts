import { useEffect, useState } from 'react'
import { humanReadableSize } from '@/helpers/utils'
import { FileManager } from '@/domain/file'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
import { useIPFS } from '@/contexts/helia'

export type WebsiteFolderField = {
  folder?: FileList
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
  folderSize: string
  handleRemove?: () => void
}

export function useAddWebsiteFolderProps({
  name = '',
  index,
  control,
  defaultValue,
  onRemove: handleRemove,
}: UseAddWebsiteFolderProps): UseAddWebsiteFolderReturn {
  const isStandAlone = index === undefined
  const n = isStandAlone ? name : `${name}.${index}`
  const { addFolder } = useIPFS()
  const folderCtrl = useController({
    control,
    name: `${n}.folder`,
    defaultValue: defaultValue?.folder,
  })

  const { value: folder } = folderCtrl.field
  const [folderSize, setFolderSize] = useState<string>('')

  useEffect(() => {
    async function load() {
      if (folder) {
        const size = await FileManager.getFolderSize(folder)
        const hSize = humanReadableSize(size, 'MiB')
        setFolderSize(hSize)
        console.log(await addFolder?.(folder))
      }
    }
    load()
  }, [folder])

  return {
    folderCtrl,
    folderSize,
    handleRemove,
  }
}