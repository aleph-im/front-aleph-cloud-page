import { useEffect, useState } from 'react'
import { humanReadableSize } from '@/helpers/utils'
import { FileManager } from '@/domain/file'
import { Control, UseControllerReturn, useController } from 'react-hook-form'
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

const addFolder = async (folder: FileList): Promise<string | undefined> => {
  const data = new FormData()
  Array.from(folder).forEach((f) => data.append('file', f))
  const query = await fetch('https://ipfs.aleph.cloud/api/v0/add?to-files=1', {
    method: 'POST',
    body: data,
  })
  if (query.status === 200)
    return JSON.parse((await query.text()).split('\n').at(-2)!)?.['Hash']
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
        const cid = await addFolder(folder)
        console.log('CID:', cid)
        cidCtrl.field.onChange(cid)
      } else if (folderSize) {
        setFolderSize('')
        cidCtrl.field.onChange('')
      }
    }
    load()
  }, [folder])

  return {
    folderCtrl,
    cidCtrl,
    folderSize,
    handleRemove,
  }
}
