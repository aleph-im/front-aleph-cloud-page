import React from 'react'
import { Icon, TextInput, Button } from '@aleph-front/aleph-core'
import { useAddDomains, useDomainItem } from '@/hooks/form/useAddDomains'
import { DomainItemProps, AddDomainsProps as AddDomainsProps } from './types'
import NoisyContainer from '@/components/common/NoisyContainer'

const DomainItem = React.memo((props: DomainItemProps) => {
  const { nameCtrl, handleRemove } = useDomainItem(props)

  return (
    <div tw="flex flex-col md:flex-row gap-6">
      <div tw="flex-1">
        <TextInput
          {...nameCtrl.field}
          {...nameCtrl.fieldState}
          placeholder="Name"
        />
      </div>
      <div tw="flex items-end md:justify-center pb-2">
        <Button
          color="main2"
          variant="secondary"
          kind="neon"
          size="regular"
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
        <NoisyContainer>
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
        </NoisyContainer>
      )}
      {fields.length < 1 && (
        <div tw="mt-6 mx-6">
          <Button
            type="button"
            onClick={handleAdd}
            color="main0"
            variant="secondary"
            kind="neon"
            size="regular"
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
