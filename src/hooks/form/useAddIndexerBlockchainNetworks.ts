import { IndexerBlockchain } from '@/helpers/constants'
import { useCallback } from 'react'
import {
  Control,
  FieldArrayWithId,
  UseControllerReturn,
  useController,
  useFieldArray,
} from 'react-hook-form'

export type IndexerBlockchainNetworkField = {
  id: string
  rpcUrl: string
  abiUrl: string
  blockchain: IndexerBlockchain
}

export const defaultValues: Partial<IndexerBlockchainNetworkField> = {
  id: '',
  blockchain: IndexerBlockchain.Ethereum,
  rpcUrl: '',
  // abiUrl: '',
}

export type UseIndexerBlockchainNetworkItemProps = {
  name?: string
  index: number
  control: Control
  defaultValue?: IndexerBlockchainNetworkField
  onRemove: (index?: number) => void
}

export type UseIndexerBlockchainNetworkItemReturn = {
  idCtrl: UseControllerReturn<any, any>
  blockchainCtrl: UseControllerReturn<any, any>
  rpcUrlCtrl: UseControllerReturn<any, any>
  // abiUrlCtrl: UseControllerReturn<any, any>
  networks: IndexerBlockchain[]
  handleRemove: () => void
}

export function useIndexerBlockchainNetworkItem({
  name = 'networks',
  index,
  control,
  defaultValue,
  onRemove,
}: UseIndexerBlockchainNetworkItemProps): UseIndexerBlockchainNetworkItemReturn {
  const idCtrl = useController({
    control,
    name: `${name}.${index}.id`,
    defaultValue: defaultValue?.id,
  })

  const blockchainCtrl = useController({
    control,
    name: `${name}.${index}.blockchain`,
    defaultValue: defaultValue?.blockchain,
  })

  const rpcUrlCtrl = useController({
    control,
    name: `${name}.${index}.rpcUrl`,
    defaultValue: defaultValue?.rpcUrl,
  })

  // const abiUrlCtrl = useController({
  //   control,
  //   name: `${name}.${index}.abiUrl`,
  //   defaultValue: defaultValue?.abiUrl,
  // })

  const networks = Object.values(IndexerBlockchain)

  const handleRemove = useCallback(() => {
    onRemove(index)
  }, [index, onRemove])

  return {
    idCtrl,
    blockchainCtrl,
    rpcUrlCtrl,
    // abiUrlCtrl,
    networks,
    handleRemove,
  }
}

// --------------------

export type UseBlockchainNetworksProps = {
  name?: string
  control: Control
}

export type UseBlockchainNetworksReturn = {
  name: string
  control: Control
  fields: FieldArrayWithId[]
  handleAdd: () => void
  handleRemove: (index?: number) => void
}

export function useAddIndexerBlockchainNetworks({
  name = 'networks',
  control,
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
    handleAdd,
    handleRemove,
  }
}
