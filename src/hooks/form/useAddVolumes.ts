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
      const updatedVolumes = [...volumes]
      const index = volumes.findIndex((vol) => vol.id === volume.id)

      if (index !== -1) {
        updatedVolumes[index] = volume
      } else {
        updatedVolumes.push(volume)
      }

      setVolumesState(updatedVolumes)
      onChange(updatedVolumes)
    },
    [onChange, volumes],
  )

  const handleAdd = useCallback(() => {
    const newVolume = {
      ...defaultVolume,
      id: `volume-${Date.now()}`,
    }

    const updatedVolumes = [...volumes, newVolume]

    setVolumesState(updatedVolumes)
    onChange(updatedVolumes)
  }, [onChange, volumes])

  const handleRemove = useCallback(
    (volumeId: string) => {
      const updatedVolumes = volumes.filter((vol) => vol.id !== volumeId)

      setVolumesState(updatedVolumes)
      onChange(updatedVolumes)
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
