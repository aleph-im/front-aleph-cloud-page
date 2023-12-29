import React from 'react'
import { useSelectCustomFunctionRuntime } from '@/hooks/form/useSelectCustomFunctionRuntime'
import { TextInput } from '@aleph-front/aleph-core'
import { NoisyContainer } from '@aleph-front/aleph-core'
import ExternalLinkButton from '@/components/common/ExternalLinkButton'
import { SelectCustomFunctionRuntimeProps } from './types'

export const SelectCustomFunctionRuntime = React.memo(
  (props: SelectCustomFunctionRuntimeProps) => {
    const { runtimeCtrl } = useSelectCustomFunctionRuntime(props)

    return (
      <>
        <NoisyContainer $type="dark">
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
        </NoisyContainer>
      </>
    )
  },
)
SelectCustomFunctionRuntime.displayName = 'SelectCustomFunctionRuntime'

export default SelectCustomFunctionRuntime
