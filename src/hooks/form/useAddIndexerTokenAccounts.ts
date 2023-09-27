import { ChangeEvent, useCallback, useMemo } from 'react'
import {
  Control,
  FieldArrayWithId,
  UseControllerReturn,
  useController,
  useFieldArray,
} from 'react-hook-form'
import { IndexerBlockchainNetworkField } from './useAddIndexerBlockchainNetworks'

export type IndexerTokenAccountField = {
  network: string
  contract: string
  deployer: string
  supply: string
  decimals: number
}

export const defaultValues: Partial<IndexerTokenAccountField> = {
  network: '',
  contract: '',
  deployer: '',
  supply: '',
}

export type UseIndexerTokenAccountItemProps = {
  name?: string
  index: number
  control: Control
  defaultValue?: IndexerTokenAccountField
  networks?: IndexerBlockchainNetworkField[]
  onRemove: (index?: number) => void
}

export type UseIndexerTokenAccountItemReturn = {
  networkCtrl: UseControllerReturn<any, any>
  contractCtrl: UseControllerReturn<any, any>
  deployerCtrl: UseControllerReturn<any, any>
  supplyCtrl: UseControllerReturn<any, any>
  decimalsCtrl: UseControllerReturn<any, any>
  decimalsValue: number | undefined
  networks: IndexerBlockchainNetworkField[]
  supplyPreview: string
  decimalsHandleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemove: () => void
}

export function useIndexerTokenAccountItem({
  name = 'tokenAccounts',
  index,
  control,
  defaultValue,
  networks = [],
  onRemove,
}: UseIndexerTokenAccountItemProps): UseIndexerTokenAccountItemReturn {
  const networkCtrl = useController({
    control,
    name: `${name}.${index}.network`,
    defaultValue: defaultValue?.network,
  })

  const contractCtrl = useController({
    control,
    name: `${name}.${index}.contract`,
    defaultValue: defaultValue?.contract,
  })

  const deployerCtrl = useController({
    control,
    name: `${name}.${index}.deployer`,
    defaultValue: defaultValue?.deployer,
  })

  const supplyCtrl = useController({
    control,
    name: `${name}.${index}.supply`,
    defaultValue: defaultValue?.supply,
  })

  const decimalsCtrl = useController({
    control,
    name: `${name}.${index}.decimals`,
    defaultValue: defaultValue?.decimals,
  })

  const decimalsValue = useMemo(() => {
    return decimalsCtrl.field.value || undefined
  }, [decimalsCtrl.field])

  const dec = decimalsCtrl.field.value
  const sup = supplyCtrl.field.value
  const supLen = supplyCtrl.field.value.length

  const supplyPreview =
    sup && dec !== undefined
      ? `${
          dec >= supLen
            ? Array.from({ length: dec - supLen + 2 }).join('0')
            : sup.substring(0, supLen - dec)
        }${dec > 0 ? '.' : ''}${sup.substring(supLen - dec)}`
      : ''

  const decimalsHandleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value)
      decimalsCtrl.field.onChange(val)
    },
    [decimalsCtrl.field],
  )

  const handleRemove = useCallback(() => {
    onRemove(index)
  }, [index, onRemove])

  return {
    networkCtrl,
    contractCtrl,
    deployerCtrl,
    supplyCtrl,
    decimalsCtrl,
    decimalsValue,
    networks,
    supplyPreview,
    decimalsHandleChange,
    handleRemove,
  }
}

// --------------------

export type UseBlockchainNetworksProps = {
  name?: string
  control: Control
  networks: IndexerBlockchainNetworkField[]
}

export type UseBlockchainNetworksReturn = {
  name: string
  control: Control
  fields: FieldArrayWithId[]
  networks: IndexerBlockchainNetworkField[]
  handleAdd: () => void
  handleRemove: (index?: number) => void
}

export function useAddIndexerTokenAccounts({
  name = 'tokenAccounts',
  control,
  networks,
}: UseBlockchainNetworksProps): UseBlockchainNetworksReturn {
  const networksCtrl = useFieldArray({
    control,
    name,
  })

  const { fields, remove: handleRemove, append } = networksCtrl

  const handleAdd = useCallback(() => {
    append({ ...defaultValues })
  }, [append])

  return {
    name,
    control,
    fields,
    networks,
    handleAdd,
    handleRemove,
  }
}
