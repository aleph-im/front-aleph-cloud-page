/* eslint-disable @next/next/no-img-element */
import { useCallback, useId } from 'react'
import {
  FunctionRuntime,
  FunctionRuntimeId,
  useSelectFunctionRuntime,
} from '@/hooks/form/useSelectFunctionRuntime'
import { Radio, RadioGroup, TextInput } from '@aleph-front/aleph-core'
import NoisyContainer from '@/components/NoisyContainer'
import ExternalLinkButton from '@/components/ExternalLinkButton'
import { isValidItemHash } from '@/helpers/utils'

export type SelectFunctionRuntimeItemProps = {
  runtime: FunctionRuntime
  selected: boolean
  onChange: (runtime: FunctionRuntime) => void
}

export type SelectFunctionRuntimeProps = {
  runtime?: FunctionRuntime
  customRuntimeHash?: string
  options?: FunctionRuntime[]
  onChange: (runtime: FunctionRuntime) => void
}

function SelectFunctionRuntimeItem({
  runtime,
  selected,
  onChange,
}: SelectFunctionRuntimeItemProps) {
  const id = useId()

  const handleChange = useCallback(() => {
    onChange(runtime)
  }, [runtime, onChange])

  return (
    <Radio
      label={runtime.name}
      name={id}
      checked={selected}
      onChange={handleChange}
    />
  )
}

export default function SelectFunctionRuntime({
  runtime: runtimeProp,
  options: optionsProp,
  onChange,
}: SelectFunctionRuntimeProps) {
  const {
    runtime,
    options,
    handleRuntimeChange,
    handleCustomRuntimeHashChange,
  } = useSelectFunctionRuntime({
    runtime: runtimeProp,
    options: optionsProp,
    onChange,
  })

  return (
    <>
      <NoisyContainer>
        <RadioGroup direction="column">
          {options.map((option) => (
            <SelectFunctionRuntimeItem
              key={option.id}
              {...{
                option,
                runtime: option,
                selected: option.id === runtime?.id,
                onChange: handleRuntimeChange,
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
}
