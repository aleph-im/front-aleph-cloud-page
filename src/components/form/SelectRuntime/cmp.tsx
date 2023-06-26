/* eslint-disable @next/next/no-img-element */
import styled from 'styled-components'
import tw from 'twin.macro'
import { useBasePath } from '@/hooks/useBasePath'
import { useCallback } from 'react'
import { Runtime, useSelectRuntime } from '@/hooks/form/useSelectRuntime'

export type SelectRuntimeItemProps = {
  runtime: Runtime
  selected: boolean
  onChange: (runtime: Runtime) => void
}

export type SelectRuntimeProps = {
  runtime?: Runtime
  options?: Runtime[]
  onChange: (runtime: Runtime) => void
}

export const StyledFlatCard = styled.div<{ $selected: boolean }>`
  ${tw`flex flex-col items-center justify-center shrink-0 cursor-pointer`}
  width: 30%;
  height: 10.125rem;
  background-color: #ffffff1a;
  border-radius: 1.5rem;
  ${({ $selected }) => $selected && `border: 1px solid white`}
`

function SelectRuntimeItem({
  runtime,
  selected,
  onChange,
}: SelectRuntimeItemProps) {
  const basePath = useBasePath()
  const imgPrefix = `${basePath}/img`

  const handleClick = useCallback(() => {
    onChange(runtime)
  }, [runtime, onChange])

  return (
    <StyledFlatCard onClick={handleClick} $selected={selected}>
      <img
        src={`${imgPrefix}/runtime/${runtime.dist}.svg`}
        alt={`${runtime.name} runtime image logo`}
      />
      {runtime.name}
    </StyledFlatCard>
  )
}

// Mocked runtimes
export default function SelectRuntime({
  runtime: runtimeProp,
  options: optionsProp,
  onChange,
}: SelectRuntimeProps) {
  const { runtime, options, handleChange } = useSelectRuntime({
    runtime: runtimeProp,
    options: optionsProp,
    onChange,
  })

  return (
    <div tw="overflow-auto max-w-full">
      <div tw="flex items-center justify-start flex-nowrap gap-6">
        {options.map((option) => (
          <SelectRuntimeItem
            key={option.id + option.name}
            {...{
              option,
              runtime: option,
              selected: option.id === runtime?.id,
              onChange: handleChange,
            }}
          />
        ))}
      </div>
    </div>
  )
}
