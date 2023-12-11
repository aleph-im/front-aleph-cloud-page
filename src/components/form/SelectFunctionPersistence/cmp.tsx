/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useSelectFunctionPersistence } from '@/hooks/form/useSelectFunctionPersistence'
import { Radio, RadioGroup } from '@aleph-front/aleph-core'
import NoisyContainer from '@/components/common/NoisyContainer'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { SelectFunctionPersistenceProps } from './types'

export const SelectFunctionPersistence = React.memo(
  (props: SelectFunctionPersistenceProps) => {
    const { isPersistentValue, isPersistentHandleChange, isPersistentCtrl } =
      useSelectFunctionPersistence(props)

    return (
      <>
        <NoisyContainer>
          <RadioGroup
            {...isPersistentCtrl.field}
            {...isPersistentCtrl.fieldState}
            value={isPersistentValue}
            onChange={isPersistentHandleChange}
            required
            direction="row"
          >
            <Radio label="Persistent" value="true" />
            <Radio label="On-demand" value="false" />
          </RadioGroup>
        </NoisyContainer>
        <div tw="mt-6 text-right">
          <ExternalLinkButton href="https://docs.aleph.im/computing/persistent">
            Learn more
          </ExternalLinkButton>
        </div>
      </>
    )
  },
)
SelectFunctionPersistence.displayName = 'SelectFunctionPersistence'

export default SelectFunctionPersistence
