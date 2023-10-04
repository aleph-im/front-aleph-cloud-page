import { Control, UseControllerReturn, useController } from 'react-hook-form'

export const defaultCapabilities = {
  internetAccess: true,
  blockchainRPC: true,
  enableAutoSnapshots: false,
}

export type UseAddFunctionCapabilitiesProps = {
  name?: string
  control: Control
  defaultValue?: typeof defaultCapabilities
}

export type UseAddFunctionCapabilitiesReturn = {
  internetAccessCtrl: UseControllerReturn<any, any>
  blockchainRPCCtrl: UseControllerReturn<any, any>
  enableAutoSnapshotsCtrl: UseControllerReturn<any, any>
}

export function useAddFunctionCapabilities({
  name = 'capabilities',
  control,
  defaultValue = defaultCapabilities,
}: UseAddFunctionCapabilitiesProps): UseAddFunctionCapabilitiesReturn {
  const internetAccessCtrl = useController({
    control,
    name: `${name}.internetAccess`,
    defaultValue: defaultValue?.internetAccess,
  })

  const blockchainRPCCtrl = useController({
    control,
    name: `${name}.internetAccess`,
    defaultValue: defaultValue?.blockchainRPC,
  })

  const enableAutoSnapshotsCtrl = useController({
    control,
    name: `${name}.internetAccess`,
    defaultValue: defaultValue?.enableAutoSnapshots,
  })

  return {
    internetAccessCtrl,
    blockchainRPCCtrl,
    enableAutoSnapshotsCtrl,
  }
}
