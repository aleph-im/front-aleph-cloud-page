import { useEffect, useState } from 'react'
import { humanReadableSize } from '@/helpers/utils'
import { Volume, VolumeManager, VolumeType } from '@/domain/volume'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type WebsiteFileField = {
  file?: File
}

export const defaultVolume: WebsiteFileField = {}

export type UseAddWebsiteFileProps = {
  name?: string
  index?: number
  control: Control
  onRemove?: () => void
  defaultValue?: WebsiteFileField
}

export type UseAddWebsiteFileReturn = {
  fileCtrl: UseControllerReturn<any, any>
  volumeSize: string
  handleRemove?: () => void
}

export function useAddWebsiteFileProps({
  name = '',
  index,
  control,
  defaultValue,
  onRemove: handleRemove,
}: UseAddWebsiteFileProps): UseAddWebsiteFileReturn {
  const isStandAlone = index === undefined
  const n = isStandAlone ? name : `${name}.${index}`

  const fileCtrl = useController({
    control,
    name: `${n}.file`,
    defaultValue: defaultValue?.file,
  })

  const { value: file } = fileCtrl.field
  const [volumeSize, setVolumeSize] = useState<string>('')

  useEffect(() => {
    async function load() {
      const size = await VolumeManager.getVolumeSize({
        volumeType: VolumeType.New,
        file,
      } as Volume)

      const hSize = humanReadableSize(size, 'MiB')
      setVolumeSize(hSize)
    }
    load()
  }, [file])

  return {
    fileCtrl,
    volumeSize,
    handleRemove,
  }
}
