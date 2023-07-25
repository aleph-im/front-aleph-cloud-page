/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useId } from 'react'
import { useSelectFunctionRuntime } from '@/hooks/form/useSelectFunctionRuntime'
import { Radio, RadioGroup, TextInput } from '@aleph-front/aleph-core'
import NoisyContainer from '@/components/common/NoisyContainer'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { isValidItemHash } from '@/helpers/utils'
import {
  SelectFunctionRuntimeItemProps,
  SelectFunctionRuntimeProps,
} from './types'
import { FunctionRuntimeId } from '@/domain/runtime'

const SelectFunctionRuntimeItem = React.memo(
  ({ runtime }: SelectFunctionRuntimeItemProps) => {
    const id = useId()

    return <Radio label={runtime.name} name={id} value={runtime.id} />
  },
)
SelectFunctionRuntimeItem.displayName = 'SelectFunctionRuntimeItem'

export const SelectFunctionRuntime = React.memo(
  (props: SelectFunctionRuntimeProps) => {
    const {
      runtime,
      options,
      handleRuntimeChange,
      handleCustomRuntimeHashChange,
    } = useSelectFunctionRuntime(props)

    return (
      <>
        <NoisyContainer>
          <RadioGroup
            value={runtime?.id}
            onChange={handleRuntimeChange}
            direction="column"
          >
            {options.map((option) => (
              <SelectFunctionRuntimeItem
                key={option.id}
                {...{
                  option,
                  runtime: option,
                }}
              />
            ))}
          </RadioGroup>

          <div
            className={
              runtime?.id !== FunctionRuntimeId.Custom
                ? 'unavailable-content'
                : ''
            }
            tw="mt-5"
          >
            <TextInput
              label="Runtime hash"
              placeholder={'3335ad270a571b...'}
              name="__config_runtime_hash"
              onChange={handleCustomRuntimeHashChange}
              disabled={!runtime || runtime.id !== FunctionRuntimeId.Custom}
              error={
                runtime?.meta && !isValidItemHash(runtime?.meta)
                  ? new Error('Invalid hash')
                  : undefined
              }
            />
          </div>
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
