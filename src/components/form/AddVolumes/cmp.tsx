import React from 'react'
import { Button } from '@aleph-front/aleph-core'
import { useAddVolumes } from '@/hooks/form/useAddVolumes'
import { AddVolumesProps } from './types'
import AddVolume from '../AddVolume'
import InfoTooltipButton from '@/components/InfoTooltipButton'

export const AddVolumes = React.memo((props: AddVolumesProps) => {
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
      <div tw="mt-6 text-right">
        <InfoTooltipButton
          my="bottom-right"
          at="top-right"
          tooltipContent={
            <div tw="text-left">
              <div>
                <div className="tp-body2 fs-md">New volume</div>
                <div className="tp-body1 fs-md">
                  <p>
                    Many Python programs require additional packages beyond
                    those present on the system by default.
                  </p>
                  <p>
                    An immutable volume is a file containing a Squashfs
                    filesystem that can be mounted read-only inside the virtual
                    machine running programs in on-demand or persistent
                    execution modes.
                  </p>
                </div>
              </div>
              <div tw="mt-6">
                <div className="tp-body2 fs-md">Existing volume</div>
                <p>
                  If this function uses the same dependencies as another
                  program, you can reference the volume hash to avoid data
                  duplication at no additional cost.
                </p>
              </div>
              <div tw="mt-6">
                <div className="tp-body2 fs-md">Persistent storage</div>
                <p>
                  By default function data are flushed on each run. A persistent
                  storage will allow you to persist data on disk.
                </p>
              </div>
            </div>
          }
        >
          Learn more
        </InfoTooltipButton>
      </div>
    </>
  )
})
AddVolumes.displayName = 'AddVolumes'

export default AddVolumes
