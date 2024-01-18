import { Tabs, Icon, TextInput, Checkbox, Button } from '@aleph-front/core'
import {
  RemoveVolumeProps,
  AddVolumeProps,
  AddExistingVolumeProps,
  AddNewVolumeProps,
  AddPersistentVolumeProps,
} from './types'
import React, { useMemo } from 'react'
import {
  useAddVolume,
  useAddExistingVolumeProps,
  useAddNewVolumeProps,
  useAddPersistentVolumeProps,
} from '@/hooks/form/useAddVolume'
import { VolumeType } from '@/domain/volume'
import { NoisyContainer } from '@aleph-front/core'
import HiddenFileInput from '@/components/common/HiddenFileInput'

const RemoveVolume = React.memo(
  ({ onRemove: handleRemove }: RemoveVolumeProps) => {
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
  },
)
RemoveVolume.displayName = 'RemoveVolume'

// -------------------------------------------------

export const AddNewVolume = React.memo((props: AddNewVolumeProps) => {
  const {
    isStandAlone,
    fileCtrl,
    mountPathCtrl,
    useLatestCtrl,
    volumeSize,
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
      <div>
        <div tw="py-4">
          <HiddenFileInput {...fileCtrl.field} {...fileCtrl.fieldState}>
            Upload squashfs volume <Icon name="arrow-up" tw="ml-4" />
          </HiddenFileInput>
        </div>
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
        {fileCtrl.field.value && (
          <div tw="mt-4">
            <TextInput label="Size" name="size" value={volumeSize} disabled />
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

const AddExistingVolume = React.memo((props: AddExistingVolumeProps) => {
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

const AddPersistentVolume = React.memo((props: AddPersistentVolumeProps) => {
  const {
    nameCtrl,
    mountPathCtrl,
    sizeCtrl,
    sizeValue,
    isFake,
    sizeHandleChange,
    handleRemove,
  } = useAddPersistentVolumeProps(props)

  return (
    <>
      <p tw="mb-6">
        {isFake ? (
          <>
            This system volume is included with your setup. You can easily
            expand your storage capacity to meet your application&apos;s
            requirements by adding additional volumes below.
          </>
        ) : (
          <>
            Create and configure persistent storage for your web3 functions,
            enabling your application to maintain data across multiple
            invocations or sessions. You can set up a customized storage
            solution tailored to your application&apos;s requirements.
          </>
        )}
      </p>
      <div>
        <div>
          <TextInput
            {...nameCtrl.field}
            {...nameCtrl.fieldState}
            disabled={isFake}
            required
            label="Volume name"
            placeholder="Redis volume"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...mountPathCtrl.field}
            {...mountPathCtrl.fieldState}
            disabled={isFake}
            required
            label="Mount"
            placeholder="/mount/opt"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...sizeCtrl.field}
            {...sizeCtrl.fieldState}
            disabled={isFake}
            value={sizeValue}
            onChange={sizeHandleChange}
            required
            type="number"
            label="Size (GB)"
            placeholder="0"
          />
        </div>
        {!isFake && handleRemove && <RemoveVolume onRemove={handleRemove} />}
      </div>
    </>
  )
})
AddPersistentVolume.displayName = 'AddPersistentVolume'

// -------------------------------------------------

const CmpMap = {
  [VolumeType.New]: AddNewVolume,
  [VolumeType.Existing]: AddExistingVolume,
  [VolumeType.Persistent]: AddPersistentVolume,
}

export const AddVolume = React.memo((props: AddVolumeProps) => {
  const { volumeTypeCtrl, isFake, defaultValue, ...rest } = useAddVolume(props)
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
      {!isFake && (
        <div tw="px-0 pb-3">
          <Tabs
            selected={volumeType}
            align="left"
            onTabChange={volumeTypeCtrl.field.onChange}
            tabs={tabs}
          />
        </div>
      )}

      <div role="tabpanel">
        {<Cmp {...rest} defaultValue={defaultValue as any} />}
      </div>
    </div>
  )
})
AddVolume.displayName = 'AddVolume'

export default AddVolume
