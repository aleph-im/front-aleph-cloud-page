import NoisyContainer from '@/components/common/NoisyContainer/styles'
import { AddFunctionCapabilitiesProps } from './types'
import { useAddFunctionCapabilities } from '@/hooks/form/useAddFunctionCapabilities'
import { Checkbox, CheckboxGroup } from '@aleph-front/aleph-core'

const AddFunctionCapabilities = (props: AddFunctionCapabilitiesProps) => {
  const { internetAccessCtrl, blockchainRPCCtrl, enableAutoSnapshotsCtrl } =
    useAddFunctionCapabilities(props)

  return (
    <NoisyContainer>
      <Checkbox
        label="Outgoing internet access"
        tw="my-3"
        {...internetAccessCtrl.field}
        {...internetAccessCtrl.fieldState}
      />

      <Checkbox
        label="Accessing blockchain RPC nodes"
        tw="my-3"
        {...blockchainRPCCtrl.field}
        {...blockchainRPCCtrl.fieldState}
      />

      <Checkbox
        label="Enable automatic snapshots (not available yet)"
        tw="my-3"
        {...enableAutoSnapshotsCtrl.field}
        {...enableAutoSnapshotsCtrl.fieldState}
        disabled
      />
    </NoisyContainer>
  )
}

export default AddFunctionCapabilities
