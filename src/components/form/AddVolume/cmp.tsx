import { isValidItemHash } from '@/helpers/utils'
import {
  Tabs,
  Icon,
  TextInput,
  Checkbox,
  Button,
} from '@aleph-front/aleph-core'
import HiddenFileInput from '../../HiddenFileInput'
import NoisyContainer from '../../NoisyContainer'
import {
  RemoveVolumeProps,
  AddVolumeProps,
  AddExistingVolumeProps,
  AddNewVolumeProps,
  AddPersistentVolumeProps,
} from './types'
import React, { useCallback, useMemo } from 'react'
import {
  Volume,
  VolumeType,
  useAddVolume,
  useAddExistingVolumeProps,
  useAddNewVolumeProps,
  useAddPersistentVolumeProps,
} from '@/hooks/form/useAddVolume'

const RemoveVolume = React.memo(({ volume, onRemove }: RemoveVolumeProps) => {
  const handleRemove = useCallback(() => {
    onRemove(volume.id)
  }, [onRemove, volume.id])

  return (
    <div tw="mt-4 pt-6 text-right">
      <Button
        type="button"
        onClick={handleRemove}
        color="main2"
        variant="secondary"
        kind="neon"
        size="regular"
      >
        Remove
      </Button>
    </div>
  )
})
RemoveVolume.displayName = 'RemoveVolume'

const AddNewVolume = React.memo((props: AddNewVolumeProps) => {
  const {
    id,
    volume,
    volumeSize,
    handleFileSrcChange,
    handleMountPathChange,
    handleUseLatestChange,
    handleRemove,
  } = useAddNewVolumeProps(props)

  return (
    <>
      <p tw="mt-1 mb-6">
        Create and configure new volumes for your web3 function by either
        uploading a dependency file or a squashfs volume. Volumes play a crucial
        role in managing dependencies and providing a volume within your
        application.
      </p>
      <NoisyContainer>
        <div tw="pb-4">
          <HiddenFileInput
            value={volume.fileSrc}
            onChange={handleFileSrcChange}
          >
            Upload squashfs volume <Icon name="arrow-up" tw="ml-4" />
          </HiddenFileInput>
        </div>
        <div tw="mt-4">
          <TextInput
            label="Mount"
            placeholder="/mount/opt"
            value={volume.mountPath}
            onChange={handleMountPathChange}
            name={`${id}_mount`}
          />
        </div>
        <div tw="mt-4">
          <TextInput
            label="Size"
            value={volumeSize}
            name={`${id}_size`}
            disabled
          />
        </div>
        <div tw="mt-4 py-4">
          <Checkbox
            label="Always update to the latest version"
            checked={volume.useLatest}
            onChange={handleUseLatestChange}
          />
        </div>
        {handleRemove && (
          <RemoveVolume volume={volume} onRemove={handleRemove} />
        )}
      </NoisyContainer>
    </>
  )
})
AddNewVolume.displayName = 'AddNewVolume'

const AddExistingVolume = React.memo((props: AddExistingVolumeProps) => {
  const {
    id,
    volume,
    handleRefHashChange,
    handleMountPathChange,
    handleUseLatestChange,
    handleRemove,
  } = useAddExistingVolumeProps(props)

  return (
    <>
      <p tw="mt-1 mb-6">
        Link existing volumes to your web3 function by pasting the reference
        hash associated with each volume. Volumes are an essential component for
        managing dependencies within your application.
      </p>

      <NoisyContainer>
        <div>
          <TextInput
            label="Mount"
            placeholder="/mount/opt"
            onChange={handleMountPathChange}
            value={volume.mountPath}
            name={`${id}_mount`}
          />
        </div>
        <div tw="mt-4">
          <TextInput
            label="Item hash"
            placeholder="3335ad270a571b..."
            onChange={handleRefHashChange}
            value={volume.refHash}
            error={
              volume.refHash && !isValidItemHash(volume.refHash || '')
                ? { message: 'Invalid hash' }
                : undefined
            }
            name={`${id}_refhash`}
          />
        </div>
        <div tw="mt-4 py-4">
          <Checkbox
            label="Always update to the latest version"
            checked={volume.useLatest}
            onChange={handleUseLatestChange}
          />
        </div>
        {handleRemove && (
          <RemoveVolume volume={volume} onRemove={handleRemove} />
        )}
      </NoisyContainer>
    </>
  )
})
AddExistingVolume.displayName = 'AddExistingVolume'

const AddPersistentVolume = React.memo((props: AddPersistentVolumeProps) => {
  const {
    id,
    volume,
    volumeSize,
    handleNameChange,
    handleMountPathChange,
    handleSizeChange,
    handleRemove,
  } = useAddPersistentVolumeProps(props)

  return (
    <>
      <p tw="mb-6">
        Create and configure persistent storage for your web3 functions,
        enabling your application to maintain data across multiple invocations
        or sessions. You can set up a customized storage solution tailored to
        your application&apos;s requirements.
      </p>
      <NoisyContainer>
        <div>
          <TextInput
            label="Volume name"
            placeholder="Redis volume"
            onChange={handleNameChange}
            value={volume.name}
            name={`${id}_name`}
            error={
              volume.name === ''
                ? new Error('Please provide a name')
                : undefined
            }
          />
        </div>
        <div tw="mt-4">
          <TextInput
            label="Mount"
            placeholder="/mount/opt"
            onChange={handleMountPathChange}
            value={volume.mountPath}
            name={`${id}_mount`}
          />
        </div>
        <div tw="mt-4">
          <TextInput
            label="Size (GB)"
            placeholder="2"
            onChange={handleSizeChange}
            value={volumeSize}
            name={`${id}_size`}
          />
        </div>
        {handleRemove && (
          <RemoveVolume volume={volume} onRemove={handleRemove} />
        )}
      </NoisyContainer>
    </>
  )
})
AddPersistentVolume.displayName = 'AddPersistentVolume'

const CmpMap = {
  [VolumeType.New]: AddNewVolume,
  [VolumeType.Existing]: AddExistingVolume,
  [VolumeType.Persistent]: AddPersistentVolume,
}

export const AddVolume = React.memo(
  ({ isStandAlone, volume: volumeProp, onChange, ...rest }: AddVolumeProps) => {
    const { volume, handleChange } = useAddVolume({
      volume: volumeProp,
      onChange,
    })

    const handleVolumeTypeChange = useCallback(
      (type: string | VolumeType) => {
        const newVolume = { ...volume, type } as Volume
        handleChange(newVolume)
      },
      [handleChange, volume],
    )

    const Cmp = useMemo(() => CmpMap[volume.type], [volume.type])

    if (isStandAlone)
      return (
        <AddNewVolume {...{ volume: volume as never, onChange, ...rest }} />
      )

    return (
      <>
        <div tw="px-0 pt-6 pb-3">
          <Tabs
            selected={volume.type}
            align="left"
            onTabChange={handleVolumeTypeChange}
            tabs={[
              {
                id: VolumeType.New,
                name: 'New volume',
              },
              {
                id: VolumeType.Existing,
                name: 'Existing volume',
              },
              {
                id: VolumeType.Persistent,
                name: 'Persistent Storage',
              },
            ]}
          />
        </div>

        <div role="tabpanel">
          {<Cmp {...{ volume: volume as never, onChange, ...rest }} />}
        </div>
      </>
    )
  },
)
AddVolume.displayName = 'AddVolume'

export default AddVolume
