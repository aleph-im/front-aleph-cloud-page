import React from 'react'
import {
  Icon,
  TextInput,
  Button,
  Dropdown,
  DropdownOption,
  NoisyContainer,
} from '@aleph-front/core'
import {
  useAddIndexerBlockchainNetworks,
  useIndexerBlockchainNetworkItem,
} from '@/hooks/form/useAddIndexerBlockchainNetworks'
import {
  IndexerBlockchainNetworkItemProps,
  AddIndexerBlockchainNetworksProps,
} from './types'

const IndexerBlockchainNetworkItem = React.memo(
  (props: IndexerBlockchainNetworkItemProps) => {
    const {
      idCtrl,
      blockchainCtrl,
      rpcUrlCtrl,
      abiUrlCtrl,
      networks,
      handleRemove,
    } = useIndexerBlockchainNetworkItem(props)

    return (
      <>
        <div tw="mt-4">
          <TextInput
            {...idCtrl.field}
            {...idCtrl.fieldState}
            required
            label="Network ID"
            placeholder="ethereum-mainnet"
          />
        </div>
        <div tw="mt-4">
          <Dropdown
            {...blockchainCtrl.field}
            {...blockchainCtrl.fieldState}
            required
            label="Blockchain"
            placeholder="Select blockchain"
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
            required
            label="RPC node url"
            placeholder="https://eth.mainnet.rpc/url"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...abiUrlCtrl.field}
            {...abiUrlCtrl.fieldState}
            label="Custom ABI url"
            placeholder="https://my.abiurl.io/$ADDRESS"
          />
          <div tw="mt-2" className="fs-10">
            Incl. the placeholder <span className="text-main0">$ADDRESS</span>{' '}
            in the URL. The system will replace it with the token address you
            provide in step 02, autofilling the form.
          </div>
        </div>
        <div tw="mt-4 pt-6 text-right">
          <Button
            color="main2"
            variant="secondary"
            kind="default"
            size="md"
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
            kind="default"
            size="md"
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
