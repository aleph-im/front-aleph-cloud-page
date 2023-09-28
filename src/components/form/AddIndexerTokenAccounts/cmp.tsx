import React from 'react'
import {
  Icon,
  TextInput,
  Button,
  Dropdown,
  DropdownOption,
} from '@aleph-front/aleph-core'
import {
  useAddIndexerTokenAccounts,
  useIndexerTokenAccountItem,
} from '@/hooks/form/useAddIndexerTokenAccounts'
import {
  IndexerTokenAccountItemProps,
  AddIndexerTokenAccountsProps,
} from './types'
import NoisyContainer from '@/components/common/NoisyContainer'

const IndexerTokenAccountItem = React.memo(
  (props: IndexerTokenAccountItemProps) => {
    const {
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
    } = useIndexerTokenAccountItem(props)

    return (
      <>
        <div tw="mt-4">
          <Dropdown
            {...networkCtrl.field}
            {...networkCtrl.fieldState}
            disabled={!networks.length}
            label="Network"
            placeholder="Select network"
          >
            {networks.map(({ id }) => (
              <DropdownOption key={id} value={id}>
                {id}
              </DropdownOption>
            ))}
          </Dropdown>
        </div>
        <div tw="mt-4">
          <TextInput
            {...contractCtrl.field}
            {...contractCtrl.fieldState}
            label="Contract address"
            placeholder="0x27702a26126e0B3702af63Ee09aC4d1A084EF628"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...deployerCtrl.field}
            {...deployerCtrl.fieldState}
            label="Deployer address"
            placeholder="0xb6e45ADfa0C7D70886bBFC990790d64620F1BAE8"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...supplyCtrl.field}
            {...supplyCtrl.fieldState}
            type="number"
            label="Initial token supply"
            placeholder="500000000000000000000000000"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...decimalsCtrl.field}
            {...decimalsCtrl.fieldState}
            value={decimalsValue}
            onChange={decimalsHandleChange}
            type="number"
            label="Token decimals"
            placeholder="18"
          />
        </div>
        {supplyPreview && (
          <div tw="mt-4 text-ellipsis overflow-hidden opacity-50">
            Supply: {supplyPreview}
          </div>
        )}
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
IndexerTokenAccountItem.displayName = 'IndexerTokenAccountItem'

export const AddIndexerTokenAccounts = React.memo(
  (props: AddIndexerTokenAccountsProps) => {
    const { name, control, fields, networks, handleAdd, handleRemove } =
      useAddIndexerTokenAccounts(props)

    return (
      <>
        {fields.length > 0 && (
          <NoisyContainer>
            <div tw="flex flex-col gap-x-6 gap-y-4">
              {fields.map((field, index) => (
                <IndexerTokenAccountItem
                  key={field.id}
                  {...{
                    name,
                    index,
                    control,
                    defaultValue: field,
                    networks,
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
AddIndexerTokenAccounts.displayName = 'AddIndexerTokenAccounts'

export default AddIndexerTokenAccounts
