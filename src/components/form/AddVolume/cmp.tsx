import { humanReadableSize, isValidItemHash } from '@/helpers/utils'
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
  ExistingVolumeTabComponentProps,
  NewVolumeTabComponentProps,
  PersistentVolumeTabComponentProps,
} from './types'
import React, { ChangeEvent, useCallback, useId, useMemo } from 'react'
import {
  ExistingVolume,
  NewVolume,
  PersistentVolume,
  Volume,
  VolumeType,
  useAddVolume,
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

// ----------

const NewVolumeTabComponent = React.memo(
  ({ volume, onRemove, onChange }: NewVolumeTabComponentProps) => {
    const id = useId()

    const handleFileSrcChange = useCallback(
      (fileSrc?: File) => {
        if (!fileSrc) return //@todo: Handle error in UI
        const newVolume: NewVolume = { ...volume, fileSrc }
        onChange(newVolume)
      },
      [onChange, volume],
    )

    const handleMountPathChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const mountPath = e.target.value
        const newVolume: NewVolume = { ...volume, mountPath }
        onChange(newVolume)
      },
      [onChange, volume],
    )

    const handleUseLatestChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const useLatest = e.target.checked
        const newVolume: NewVolume = { ...volume, useLatest }
        onChange(newVolume)
      },
      [onChange, volume],
    )

    const volumeSize = useMemo(
      () => humanReadableSize((volume.fileSrc?.size || 0) / 1000),
      [volume.fileSrc?.size],
    )

    return (
      <>
        <p tw="mt-1 mb-6">
          Create and configure new volumes for your web3 function by either
          uploading a dependency file or a squashfs volume. Volumes play a
          crucial role in managing dependencies and providing a volume within
          your application.
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
              name={id + '_mount'}
            />
          </div>
          <div tw="mt-4">
            <TextInput
              label="Size"
              value={volumeSize}
              name={id + '_size'}
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
          {onRemove && <RemoveVolume volume={volume} onRemove={onRemove} />}
        </NoisyContainer>
      </>
    )
  },
)
NewVolumeTabComponent.displayName = 'NewVolumeTabComponent'

// ----------

const ExistingVolumeTabComponent = React.memo(
  ({ volume, onChange, onRemove }: ExistingVolumeTabComponentProps) => {
    const id = useId()

    const handleRefHashChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const refHash = e.target.value
        const newVolume: ExistingVolume = { ...volume, refHash }
        onChange(newVolume)
      },
      [onChange, volume],
    )

    const handleMountPathChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const mountPath = e.target.value
        const newVolume: ExistingVolume = { ...volume, mountPath }
        onChange(newVolume)
      },
      [onChange, volume],
    )

    const handleUseLatestChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const useLatest = e.target.checked
        const newVolume: ExistingVolume = { ...volume, useLatest }
        onChange(newVolume)
      },
      [onChange, volume],
    )

    return (
      <>
        <p tw="mt-1 mb-6">
          Link existing volumes to your web3 function by pasting the reference
          hash associated with each volume. Volumes are an essential component
          for managing dependencies within your application.
        </p>

        <NoisyContainer>
          <div>
            <TextInput
              label="Mount"
              placeholder="/mount/opt"
              onChange={handleMountPathChange}
              value={volume.mountPath}
              name={id + '_mount'}
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
              name={id + '_refhash'}
            />
          </div>
          <div tw="mt-4 py-4">
            <Checkbox
              label="Always update to the latest version"
              checked={volume.useLatest}
              onChange={handleUseLatestChange}
            />
          </div>
          {onRemove && <RemoveVolume volume={volume} onRemove={onRemove} />}
        </NoisyContainer>
      </>
    )
  },
)
ExistingVolumeTabComponent.displayName = 'ExistingVolumeTabComponent'

// ----------

const PersistentVolumeTabComponent = React.memo(
  ({ volume, onChange, onRemove }: PersistentVolumeTabComponentProps) => {
    const id = useId()

    const handleNameChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        const newVolume: PersistentVolume = { ...volume, name }
        onChange(newVolume)
      },
      [onChange, volume],
    )

    const handleMountPathChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const mountPath = e.target.value
        const newVolume: PersistentVolume = { ...volume, mountPath }
        onChange(newVolume)
      },
      [onChange, volume],
    )

    const handleSizeChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const size = Number(e.target.value)
        const newVolume: PersistentVolume = { ...volume, size }
        onChange(newVolume)
      },
      [onChange, volume],
    )

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
              name={id + '_name'}
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
              name={id + '_mount'}
            />
          </div>
          <div tw="mt-4">
            <TextInput
              label="Size (GB)"
              placeholder="2"
              onChange={handleSizeChange}
              value={volume.size}
              name={id + '_size'}
            />
          </div>
          {onRemove && <RemoveVolume volume={volume} onRemove={onRemove} />}
        </NoisyContainer>
      </>
    )
  },
)
PersistentVolumeTabComponent.displayName = 'PersistentVolumeTabComponent'

// ----------

const CmpMap = {
  [VolumeType.New]: NewVolumeTabComponent,
  [VolumeType.Existing]: ExistingVolumeTabComponent,
  [VolumeType.Persistent]: PersistentVolumeTabComponent,
}

export default function AddVolume({
  isStandAlone,
  volume: volumeProp,
  onChange,
  ...rest
}: AddVolumeProps) {
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
      <NewVolumeTabComponent
        {...{ volume: volume as NewVolume, onChange, ...rest }}
      />
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
}
