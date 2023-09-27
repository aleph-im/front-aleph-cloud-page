import React from 'react'
import {
  Icon,
  TextInput,
  Button,
  Dropdown,
  DropdownOption,
} from '@aleph-front/aleph-core'
import {
  useAddIndexerBlockchainNetworks,
  useIndexerBlockchainNetworkItem,
} from '@/hooks/form/useAddIndexerBlockchainNetworks'
import {
  IndexerBlockchainNetworkItemProps,
  AddIndexerBlockchainNetworksProps,
} from './types'
import NoisyContainer from '@/components/common/NoisyContainer'

const IndexerBlockchainNetworkItem = React.memo(
  (props: IndexerBlockchainNetworkItemProps) => {
    const { idCtrl, blockchainCtrl, rpcUrlCtrl, networks, handleRemove } =
      useIndexerBlockchainNetworkItem(props)

    return (
      <>
        <div tw="mt-4">
          <TextInput
            {...idCtrl.field}
            {...idCtrl.fieldState}
            label="Id"
            placeholder="ethereum-mainnet"
          />
        </div>
        <div tw="mt-4">
          <Dropdown
            {...blockchainCtrl.field}
            {...blockchainCtrl.fieldState}
            label="Blockchain"
            placeholder="ethereum"
          >
            {networks.map((value) => (
              <DropdownOption key={value} value={value}>
                {value}
              </DropdownOption>
            ))}
          </Dropdown>
        </div>

        <div tw="mt-4">
          <TextInput
            {...rpcUrlCtrl.field}
            {...rpcUrlCtrl.fieldState}
            label="RPC node url"
            placeholder="https://eth.mainnet.rpc/url"
          />
        </div>
        {/* <div tw="mt-4">
          <TextInput
            {...abiUrlCtrl.field}
            {...abiUrlCtrl.fieldState}
            label="ABI url"
            placeholder="https://eth.scan/path-to-abi-address-will-be-replaced/$ADDRESS"
          />
        </div> */}
        <div tw="mt-4 pt-6 text-right">
          <Button
            color="main2"
            variant="secondary"
            kind="neon"
            size="regular"
            type="button"
            onClick={handleRemove}
          >
            <Icon name="trash" tw="mr-4" /> Remove
          </Button>
        </div>
      </>
    )
  },
)
IndexerBlockchainNetworkItem.displayName = 'IndexerBlockchainNetworkItem'

export const AddIndexerBlockchainNetworks = React.memo(
  (props: AddIndexerBlockchainNetworksProps) => {
    const { name, control, fields, handleAdd, handleRemove } =
      useAddIndexerBlockchainNetworks(props)

    return (
      <>
        {fields.length > 0 && (
          <NoisyContainer>
            <div tw="flex flex-col gap-x-6 gap-y-4">
              {fields.map((field, index) => (
                <IndexerBlockchainNetworkItem
                  key={field.id}
                  {...{
                    name,
                    index,
                    control,
                    defaultValue: field,
                    onRemove: handleRemove,
                  }}
                />
              ))}
            </div>
          </NoisyContainer>
        )}
        <div tw="mt-6 mx-6">
          <Button
            type="button"
            onClick={handleAdd}
            color="main0"
            variant="secondary"
            kind="neon"
            size="regular"
          >
            Add network
          </Button>
        </div>
      </>
    )
  },
)
AddIndexerBlockchainNetworks.displayName = 'AddIndexerBlockchainNetworks'

export default AddIndexerBlockchainNetworks
