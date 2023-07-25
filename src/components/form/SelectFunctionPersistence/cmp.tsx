/* eslint-disable @next/next/no-img-element */
import React, { useId } from 'react'
import { useSelectFunctionPersistence } from '@/hooks/form/useSelectFunctionPersistence'
import { Radio, RadioGroup } from '@aleph-front/aleph-core'
import NoisyContainer from '@/components/common/NoisyContainer'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { SelectFunctionPersistenceProps } from './types'

export const SelectFunctionPersistence = React.memo(
  (props: SelectFunctionPersistenceProps) => {
    const { value, handleChange } = useSelectFunctionPersistence(props)
    const id = useId()

    return (
      <>
        <NoisyContainer>
          <RadioGroup value={value} onChange={handleChange} direction="row">
            <Radio name={id} label="Persistent" value="true" />
            <Radio name={id} label="On-demand" value="false" />
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
