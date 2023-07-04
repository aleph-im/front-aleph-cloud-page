import { Button } from '@aleph-front/aleph-core'
import { useAddVolumes } from '@/hooks/form/useAddVolumes'
import { AddVolumesProps } from './types'
import AddVolume from '../AddVolume'

export default function AddVolumes(props: AddVolumesProps) {
  const { volumes, handleAdd, handleRemove, handleChange } =
    useAddVolumes(props)

  return (
    <>
      {volumes.map((volume) => (
        <AddVolume
          key={volume.id}
          volume={volume}
          onRemove={handleRemove}
          onChange={handleChange}
        />
      ))}
      <div tw="mt-6 mx-6">
        <Button
          type="button"
          onClick={handleAdd}
          color="main0"
          variant="secondary"
          kind="neon"
          size="regular"
        >
          {volumes.length > 0 ? 'Add another volume' : 'Add volume'}
        </Button>
      </div>
    </>
  )
}
