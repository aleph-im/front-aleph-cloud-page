import React, { memo, useMemo } from 'react'
import {
  Tabs,
  TextInput,
  Checkbox,
  Button,
  NoisyContainer,
  FileInput,
} from '@aleph-front/core'
import {
  RemoveVolumeProps,
  AddVolumeProps,
  AddExistingVolumeProps,
  AddNewVolumeProps,
  AddPersistentVolumeProps,
  InstanceSystemVolumeProps,
} from './types'
import {
  useAddVolume,
  useAddExistingVolumeProps,
  useAddNewVolumeProps,
  useAddPersistentVolumeProps,
  useAddInstanceSystemVolumeProps,
} from '@/hooks/form/useAddVolume'
import { VolumeType } from '@/domain/volume'

const RemoveVolume = memo(({ onRemove: handleRemove }: RemoveVolumeProps) => {
  return (
    <div tw="mt-4 pt-6 text-right">
      <Button
        type="button"
        kind="functional"
        variant="warning"
        size="md"
        onClick={handleRemove}
      >
        Remove
      </Button>
    </div>
  )
})
RemoveVolume.displayName = 'RemoveVolume'

// -------------------------------------------------

export const AddNewVolume = memo((props: AddNewVolumeProps) => {
  const { isStandAlone, fileCtrl, mountPathCtrl, useLatestCtrl, handleRemove } =
    useAddNewVolumeProps(props)

  return (
    <>
      <p tw="mt-1 mb-6">
        Create and configure new volumes for your web3 function by either
        uploading a dependency file or a squashfs volume. Volumes play a crucial
        role in managing dependencies and providing a volume within your
        application.
      </p>
      <div>
        {isStandAlone ? (
          <NoisyContainer>
            <FileInput
              {...fileCtrl.field}
              {...fileCtrl.fieldState}
              label="Upload volume file"
              required
            />
          </NoisyContainer>
        ) : (
          <div tw="py-4">
            <FileInput {...fileCtrl.field} {...fileCtrl.fieldState} />
          </div>
        )}
        {!isStandAlone && (
          <div tw="mt-4">
            <TextInput
              {...mountPathCtrl.field}
              {...mountPathCtrl.fieldState}
              required
              label="Mount"
              placeholder="/mount/opt"
            />
          </div>
        )}
        {!isStandAlone && (
          <>
            <div tw="mt-4 py-4">
              <Checkbox
                {...useLatestCtrl.field}
                {...useLatestCtrl.fieldState}
                label="Always update to the latest version"
              />
            </div>
            {handleRemove && <RemoveVolume onRemove={handleRemove} />}
          </>
        )}
      </div>
    </>
  )
})
AddNewVolume.displayName = 'AddNewVolume'

// -------------------------------------------------

const AddExistingVolume = memo((props: AddExistingVolumeProps) => {
  const {
    refHashCtrl,
    mountPathCtrl,
    useLatestCtrl,
    volumeSize,
    handleRemove,
  } = useAddExistingVolumeProps(props)

  return (
    <>
      <p tw="mt-1 mb-6">
        Link existing volumes to your web3 function by pasting the reference
        hash associated with each volume. Volumes are an essential component for
        managing dependencies within your application.
      </p>
      <div>
        <div>
          <TextInput
            {...mountPathCtrl.field}
            {...mountPathCtrl.fieldState}
            required
            label="Mount"
            placeholder="/mount/opt"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...refHashCtrl.field}
            {...refHashCtrl.fieldState}
            required
            label="Item hash"
            placeholder="3335ad270a571b..."
          />
        </div>
        {refHashCtrl.field.value && volumeSize && (
          <div tw="mt-4">
            <TextInput label="Size" name="size" value={volumeSize} disabled />
          </div>
        )}
        <div tw="mt-4 py-4">
          <Checkbox
            {...useLatestCtrl.field}
            {...useLatestCtrl.fieldState}
            checked={!!useLatestCtrl.field.value}
            label="Always update to the latest version"
          />
        </div>
        {handleRemove && <RemoveVolume onRemove={handleRemove} />}
      </div>
    </>
  )
})
AddExistingVolume.displayName = 'AddExistingVolume'

// -------------------------------------------------

const AddPersistentVolume = memo((props: AddPersistentVolumeProps) => {
  const {
    nameCtrl,
    mountPathCtrl,
    sizeCtrl,
    sizeValue,
    sizeHandleChange,
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
      <div>
        <div>
          <TextInput
            {...nameCtrl.field}
            {...nameCtrl.fieldState}
            required
            label="Volume name"
            placeholder="Redis volume"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...mountPathCtrl.field}
            {...mountPathCtrl.fieldState}
            required
            label="Mount"
            placeholder="/mount/opt"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...sizeCtrl.field}
            {...sizeCtrl.fieldState}
            value={sizeValue}
            onChange={sizeHandleChange}
            required
            type="number"
            label="Size (GB)"
            placeholder="0"
          />
        </div>
        {handleRemove && <RemoveVolume onRemove={handleRemove} />}
      </div>
    </>
  )
})
AddPersistentVolume.displayName = 'AddPersistentVolume'

// -------------------------------------------------

export const InstanceSystemVolume = memo((props: InstanceSystemVolumeProps) => {
  const { sizeCtrl } = useAddInstanceSystemVolumeProps(props)

  return (
    <>
      <p tw="mb-6">
        This system volume is included with your setup. You can easily expand
        your storage capacity to meet your application&apos;s requirements by
        adding additional volumes below.
      </p>
      <div>
        <div>
          <TextInput
            name="system_volume_name"
            required
            label="Volume name"
            placeholder="Redis volume"
            value="System Volume"
            dataView
          />
        </div>
        <div tw="mt-4">
          <TextInput
            name="system_volume_mount"
            required
            label="Mount"
            placeholder="/mount/opt"
            value="/"
            dataView
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...sizeCtrl.field}
            {...sizeCtrl.fieldState}
            name="system_volume_size"
            required
            type="number"
            label="Size (GB)"
            placeholder="0"
          />
        </div>
      </div>
    </>
  )
})
InstanceSystemVolume.displayName = 'InstanceSystemVolume'

// -------------------------------------------------

const CmpMap = {
  [VolumeType.New]: AddNewVolume,
  [VolumeType.Existing]: AddExistingVolume,
  [VolumeType.Persistent]: AddPersistentVolume,
}

export const AddVolume = memo((props: AddVolumeProps) => {
  const { volumeTypeCtrl, defaultValue, ...rest } = useAddVolume(props)
  const volumeType = volumeTypeCtrl.field.value as VolumeType

  const Cmp = useMemo(() => CmpMap[volumeType], [volumeType])

  const tabs = useMemo(
    () => [
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
    ],
    [],
  )

  return (
    <div className="bg-base1" tw="p-6">
      <div tw="px-0 pb-3">
        <Tabs
          selected={volumeType}
          align="left"
          onTabChange={volumeTypeCtrl.field.onChange}
          tabs={tabs}
        />
      </div>

      <div role="tabpanel">
        {<Cmp {...rest} defaultValue={defaultValue as any} />}
      </div>
    </div>
  )
})
AddVolume.displayName = 'AddVolume'

export default AddVolume
