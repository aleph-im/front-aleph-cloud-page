import React from 'react'
import { Button } from '@aleph-front/core'
import { useAddVolumes } from '@/hooks/form/useAddVolumes'
import { AddVolumesProps } from './types'
import AddVolume from '../AddVolume'
import InfoTooltipButton from '@/components/common/InfoTooltipButton'

export const AddVolumes = React.memo((props: AddVolumesProps) => {
  const { name, control, fields, handleAdd, handleRemove } =
    useAddVolumes(props)

  return (
    <>
      <div tw="flex flex-col gap-6">
        {fields.map((field, index) => (
          <AddVolume
            key={field.id}
            {...{
              name,
              index,
              control,
              defaultValue: field,
              onRemove: handleRemove,
            }}
          />
        ))}
      </div>
      <div tw="mt-6">
        <Button
          type="button"
          onClick={handleAdd}
          color="main0"
          variant="secondary"
          kind="default"
          size="md"
        >
          Add volume
        </Button>
      </div>
      <div tw="mt-6 text-right">
        <InfoTooltipButton
          my="bottom-right"
          at="top-right"
          tooltipContent={
            <div tw="text-left">
              <div>
                <div className="tp-body2 fs-18">New volume</div>
                <div className="tp-body1 fs-18">
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
                <div className="tp-body2 fs-18">Existing volume</div>
                <p>
                  If this function uses the same dependencies as another
                  program, you can reference the volume hash to avoid data
                  duplication at no additional cost.
                </p>
              </div>
              <div tw="mt-6">
                <div className="tp-body2 fs-18">Persistent storage</div>
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
