import React from 'react'
import { Icon, TextInput, Button, NoisyContainer } from '@aleph-front/core'
import { useAddDomains, useDomainItem } from '@/hooks/form/useAddDomains'
import { DomainItemProps, AddDomainsProps as AddDomainsProps } from './types'

const DomainItem = React.memo((props: DomainItemProps) => {
  const { nameCtrl, handleRemove } = useDomainItem(props)

  return (
    <div tw="flex flex-col md:flex-row gap-6">
      <div tw="flex-1">
        <TextInput
          {...nameCtrl.field}
          {...nameCtrl.fieldState}
          required
          placeholder="Name"
        />
      </div>
      <div tw="flex items-end md:justify-center pb-2">
        <Button
          color="main2"
          variant="secondary"
          kind="default"
          size="md"
          type="button"
          onClick={handleRemove}
        >
          <Icon name="trash" />
        </Button>
      </div>
    </div>
  )
})
DomainItem.displayName = 'DomainItem'

export const AddDomains = React.memo((props: AddDomainsProps) => {
  const { name, control, fields, handleAdd, handleRemove } =
    useAddDomains(props)

  return (
    <>
      {fields.length > 0 && (
        <div className="bg-base1" tw="p-6">
          <div tw="flex flex-col gap-x-6 gap-y-4">
            {fields.map((field, index) => (
              <DomainItem
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
        </div>
      )}
      {fields.length < 1 && (
        <div tw="mt-6 mx-6">
          <Button
            type="button"
            onClick={handleAdd}
            color="main0"
            variant="secondary"
            kind="default"
            size="md"
          >
            Add domain
          </Button>
        </div>
      )}
    </>
  )
})
AddDomains.displayName = 'AddDomains'

export default AddDomains
