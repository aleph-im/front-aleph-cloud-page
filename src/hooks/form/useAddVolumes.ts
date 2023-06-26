import { useCallback, useState } from 'react'
import { Volume, defaultVolume } from './useAddVolume'

export type UseAddVolumesProps = {
  volumes?: Volume[]
  onChange: (volumes: Volume[]) => void
}

export type UseAddVolumesReturn = {
  volumes: Volume[]
  handleChange: (volumes: Volume) => void
  handleAdd: () => void
  handleRemove: (volumeId: string) => void
}

export function useAddVolumes({
  volumes: volumesProp,
  onChange,
}: UseAddVolumesProps): UseAddVolumesReturn {
  const [volumesState, setVolumesState] = useState<Volume[]>([])
  const volumes = volumesProp || volumesState

  const handleChange = useCallback(
    (volume: Volume) => {
      if (!volumes) return

      const newVolumes = [...volumes]
      const i = volumes.findIndex((vol) => vol.id === volume.id)
      newVolumes[i] = volume

      setVolumesState(newVolumes)
      onChange(newVolumes)
    },
    [onChange, volumes],
  )

  const handleAdd = useCallback(() => {
    const newVolume = {
      ...defaultVolume,
      id: `volume-${Date.now()}`,
    }

    const newVolumes = [...volumes, newVolume]

    setVolumesState(newVolumes)
    onChange(newVolumes)
  }, [onChange, volumes])

  const handleRemove = useCallback(
    (volumeId: string) => {
      if (!volumes) return

      const newVolumes = volumes.filter((vol) => vol.id !== volumeId)

      setVolumesState(newVolumes)
      onChange(newVolumes)
    },
    [onChange, volumes],
  )

  return {
    volumes,
    handleChange,
    handleAdd,
    handleRemove,
  }
}
