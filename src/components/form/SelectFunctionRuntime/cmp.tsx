import React from 'react'
import { useSelectFunctionRuntime } from '@/hooks/form/useSelectFunctionRuntime'
import { Radio, RadioGroup, TextInput } from '@aleph-front/aleph-core'
import NoisyContainer from '@/components/common/NoisyContainer'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { SelectFunctionRuntimeProps } from './types'

export const SelectFunctionRuntime = React.memo(
  (props: SelectFunctionRuntimeProps) => {
    const { customCtrl, idCtrl, isCustomDisabled, options } =
      useSelectFunctionRuntime(props)

    return (
      <>
        <NoisyContainer>
          <RadioGroup
            {...idCtrl.field}
            {...idCtrl.fieldState}
            direction="column"
          >
            {options.map((option) => (
              <Radio
                key={option.id}
                {...{
                  label: option.name,
                  value: option.id,
                }}
              />
            ))}
          </RadioGroup>
          {!isCustomDisabled && (
            <div tw="mt-5">
              <TextInput
                {...customCtrl.field}
                {...customCtrl.fieldState}
                label="Runtime hash"
                placeholder={'3335ad270a571b...'}
              />
            </div>
          )}
        </NoisyContainer>
        <div tw="mt-6 text-right">
          <ExternalLinkButton href="https://docs.aleph.im/computing/runtimes">
            Learn more
          </ExternalLinkButton>
        </div>
      </>
    )
  },
)
SelectFunctionRuntime.displayName = 'SelectFunctionRuntime'

export default SelectFunctionRuntime
