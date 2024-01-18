import React, { memo } from 'react'
import { SelectStreamDurationProps } from './types'
import { useSelectStreamDuration } from '@/hooks/form/useSelectStreamDuration'
import { Dropdown, DropdownOption, TextInput } from '@aleph-front/core'

export const SelectStreamDuration = (props: SelectStreamDurationProps) => {
  const { durationCtrl, unitCtrl } = useSelectStreamDuration(props)

  return (
    <div tw="w-full flex items-stretch gap-6">
      <div tw="flex-1">
        <TextInput
          {...{
            ...durationCtrl.field,
            ...durationCtrl.fieldState,
            type: 'number',
            placeholder: 'Duration',
            label: 'Specify Duration',
          }}
        />
      </div>
      <div tw="flex-1">
        <Dropdown
          {...{
            ...unitCtrl.field,
            ...unitCtrl.fieldState,
            placeholder: 'Time units',
            label: 'Select Time Unit',
          }}
        >
          <DropdownOption value="h">Hour</DropdownOption>
          <DropdownOption value="d">Day</DropdownOption>
          <DropdownOption value="m">Month</DropdownOption>
          <DropdownOption value="y">Year</DropdownOption>
        </Dropdown>
      </div>
    </div>
  )
}
SelectStreamDuration.displayName = 'SelectStreamDuration'

export default memo(SelectStreamDuration) as typeof SelectStreamDuration
