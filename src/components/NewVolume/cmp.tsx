import { humanReadableSize, isValidItemHash } from '@/helpers/utils'
import {
  Tabs,
  Icon,
  TextInput,
  Checkbox,
  Button,
} from '@aleph-front/aleph-core'
import HiddenFileInput from '../HiddenFileInput'
import NoisyContainer from '../NoisyContainer'
import { RemoveVolumeProps, NewVolumeProps } from './types'
import { useMemo, useState } from 'react'
import { VolumeTypes } from '@/helpers/form'

const RemoveVolume = ({ removeCallback }: RemoveVolumeProps) => (
  <div tw="mt-4 pt-6 text-right">
    <Button
      type="button"
      onClick={removeCallback}
      color="main2"
      variant="secondary"
      kind="neon"
      size="regular"
    >
      Remove
    </Button>
  </div>
)

export default function NewVolume({
  volumeMountpoint,
  volumeRefHash,
  volumeName,
  volumeSize,
  volumeSrc,
  volumeUseLatest,
  handleMountpointChange,
  handleNameChange,
  handleSizeChange,
  handleSrcChange,
  handleUseLatestChange,
  handleRefHashChange,
  handleVolumeType,
  removeCallback,
  isStandAlone,
}: NewVolumeProps) {
  const namePrefix = useMemo(
    () => Math.abs((Math.random() * 10 ** 16) | 0).toString(16),
    [],
  )

  const [tabId, setTabId] = useState('new')

  const NewVolumeTabComponent = () => (
    <>
      <p tw="mt-1 mb-6">
        Create and configure new volumes for your web3 function by either
        uploading a dependency file or a squashfs volume. Volumes play a crucial
        role in managing dependencies and providing a volume within your
        application.
      </p>
      <NoisyContainer>
        <div tw="flex justify-between">
          <HiddenFileInput value={volumeSrc} onChange={handleSrcChange}>
            Upload squashfs volume <Icon name="arrow-up" tw="ml-4" />
          </HiddenFileInput>
          <strong>or</strong>
          <div className="unavailable-content">
            <HiddenFileInput onChange={handleSrcChange}>
              Upload dependency file <Icon name="arrow-up" tw="ml-4" />
            </HiddenFileInput>
          </div>
        </div>
        <div tw="mt-4">
          <TextInput
            label="Mount"
            placeholder="/mount/opt"
            onChange={handleMountpointChange}
            value={volumeMountpoint}
            name={namePrefix + '_mount'}
          />
        </div>
        <div tw="mt-4">
          <TextInput
            label="Size"
            disabled
            value={humanReadableSize((volumeSrc?.size || 0) / 1000)}
            name={namePrefix + '_size'}
          />
        </div>
        <div tw="mt-4 py-4">
          <Checkbox
            label="Always update to the latest version"
            checked={volumeUseLatest}
            onChange={handleUseLatestChange}
          />
        </div>
        {removeCallback !== undefined && (
          <RemoveVolume removeCallback={removeCallback} />
        )}
      </NoisyContainer>
    </>
  )

  if (isStandAlone) return <NewVolumeTabComponent />

  return (
    <>
      <div tw="px-0 pt-6 pb-3">
        <Tabs
          selected={tabId}
          align="left"
          onTabChange={(id) => {
            setTabId(id)
            handleVolumeType(id as VolumeTypes)
          }}
          tabs={[
            {
              id: 'new' as VolumeTypes,
              name: 'New volume',
            },
            {
              id: 'existing' as VolumeTypes,
              name: 'Existing volume',
            },
            {
              id: 'persistent' as VolumeTypes,
              name: 'Persistent Storage',
            },
          ]}
        />
      </div>

      <div role="tabpanel">
        {tabId === 'new' ? (
          <NewVolumeTabComponent />
        ) : tabId === 'existing' ? (
          <>
            <p tw="mt-1 mb-6">
              Link existing volumes to your web3 function by pasting the
              reference hash associated with each volume. Volumes are an
              essential component for managing dependencies within your
              application.
            </p>

            <NoisyContainer>
              <div>
                <TextInput
                  label="Mount"
                  placeholder="/mount/opt"
                  onChange={handleMountpointChange}
                  value={volumeMountpoint}
                  name={namePrefix + '_mount'}
                />
              </div>
              <div tw="mt-4">
                <TextInput
                  label="Item hash"
                  placeholder="3335ad270a571b..."
                  onChange={handleRefHashChange}
                  value={volumeRefHash}
                  error={
                    volumeRefHash && !isValidItemHash(volumeRefHash || '')
                      ? { message: 'Invalid hash' }
                      : undefined
                  }
                  name={namePrefix + '_refhash'}
                />
              </div>
              <div tw="mt-4 py-4">
                <Checkbox
                  label="Always update to the latest version"
                  checked={volumeUseLatest}
                  onChange={handleUseLatestChange}
                />
              </div>
              {removeCallback !== undefined && (
                <RemoveVolume removeCallback={removeCallback} />
              )}
            </NoisyContainer>
          </>
        ) : tabId === 'persistent' ? (
          <>
            <p tw="mb-6">
              Create and configure persistent storage for your web3 functions,
              enabling your application to maintain data across multiple
              invocations or sessions. You can set up a customized storage
              solution tailored to your application&apos;s requirements.
            </p>
            <NoisyContainer>
              <div>
                <TextInput
                  label="Volume name"
                  placeholder="Redis volume"
                  onChange={handleNameChange}
                  value={volumeName}
                  name={namePrefix + '_name'}
                  error={
                    volumeName === ''
                      ? new Error('Please provide a name')
                      : undefined
                  }
                />
              </div>
              <div tw="mt-4">
                <TextInput
                  label="Mount"
                  placeholder="/mount/opt"
                  onChange={handleMountpointChange}
                  value={volumeMountpoint}
                  name={namePrefix + '_mount'}
                />
              </div>
              <div tw="mt-4">
                <TextInput
                  label="Size (GB)"
                  placeholder="2"
                  onChange={handleSizeChange}
                  value={volumeSize}
                  name={namePrefix + '_size'}
                />
              </div>
              {removeCallback !== undefined && (
                <RemoveVolume removeCallback={removeCallback} />
              )}
            </NoisyContainer>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
