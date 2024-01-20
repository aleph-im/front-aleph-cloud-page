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
  useAddIndexerTokenAccounts,
  useIndexerTokenAccountItem,
} from '@/hooks/form/useAddIndexerTokenAccounts'
import {
  IndexerTokenAccountItemProps,
  AddIndexerTokenAccountsProps,
} from './types'

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
      networkDisabled,
      decimalsHandleChange,
      handleRemove,
    } = useIndexerTokenAccountItem(props)

    return (
      <>
        <div tw="mt-4">
          <Dropdown
            {...networkCtrl.field}
            {...networkCtrl.fieldState}
            required
            disabled={networkDisabled}
            label="Network ID"
            placeholder="Select network ID"
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
            required
            label="Contract address"
            placeholder="0x27702a26126e0B3702af63Ee09aC4d1A084EF628"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...deployerCtrl.field}
            {...deployerCtrl.fieldState}
            required
            label="Deployer address"
            placeholder="0xb6e45ADfa0C7D70886bBFC990790d64620F1BAE8"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...supplyCtrl.field}
            {...supplyCtrl.fieldState}
            required
            type="number"
            label="Initial token supply"
            placeholder="500000000000000000000000000"
          />
        </div>
        <div tw="mt-4">
          <TextInput
            {...decimalsCtrl.field}
            {...decimalsCtrl.fieldState}
            required
            value={decimalsValue}
            onChange={decimalsHandleChange}
            type="number"
            label="Token decimals"
            placeholder="18"
          />
          {supplyPreview && (
            <div tw="mt-2 text-ellipsis overflow-hidden" className="fs-10">
              Supply: <span className="text-main0">{supplyPreview}</span>
            </div>
          )}
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
            kind="default"
            size="md"
          >
            Add account
          </Button>
        </div>
      </>
    )
  },
)
AddIndexerTokenAccounts.displayName = 'AddIndexerTokenAccounts'

export default AddIndexerTokenAccounts
