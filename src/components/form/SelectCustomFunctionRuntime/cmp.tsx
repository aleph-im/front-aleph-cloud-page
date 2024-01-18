import React from 'react'
import { useSelectCustomFunctionRuntime } from '@/hooks/form/useSelectCustomFunctionRuntime'
import { TextInput } from '@aleph-front/core'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { SelectCustomFunctionRuntimeProps } from './types'

export const SelectCustomFunctionRuntime = React.memo(
  (props: SelectCustomFunctionRuntimeProps) => {
    const { runtimeCtrl } = useSelectCustomFunctionRuntime(props)

    return (
      <>
        <div className="bg-base1" tw="p-6">
          <TextInput
            {...runtimeCtrl.field}
            {...runtimeCtrl.fieldState}
            label="Runtime hash"
            placeholder="f6872f58fd38cbc123e9e036861a858...079ff2c123e9e08c123e9e0368fa68e"
          />
          <div tw="mt-6 text-right">
            <ExternalLinkButton href="https://docs.aleph.im/computing/runtimes">
              Learn more
            </ExternalLinkButton>
          </div>
        </div>
      </>
    )
  },
)
SelectCustomFunctionRuntime.displayName = 'SelectCustomFunctionRuntime'

export default SelectCustomFunctionRuntime
