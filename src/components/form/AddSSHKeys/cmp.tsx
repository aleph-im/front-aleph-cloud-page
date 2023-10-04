import React from 'react'
import {
  Icon,
  TextInput,
  Button,
  Checkbox,
  FormError,
} from '@aleph-front/aleph-core'
import { useAddSSHKeys, useSSHKeyItem } from '@/hooks/form/useAddSSHKeys'
import { SSHKeyItemProps, AddSSHKeysProps } from './types'
import NoisyContainer from '@/components/common/NoisyContainer'

const SSHKeyItem = React.memo((props: SSHKeyItemProps) => {
  const {
    index,
    keyCtrl,
    labelCtrl,
    isSelectedCtrl,
    allowRemove,
    isNew,
    handleRemove,
  } = useSSHKeyItem(props)

  return (
    <>
      {isSelectedCtrl.fieldState.error && (
        <FormError error={isSelectedCtrl.fieldState.error} />
      )}
      <div tw="flex gap-6">
        <div tw="flex items-start pt-11">
          <Checkbox
            {...isSelectedCtrl.field}
            {...isSelectedCtrl.fieldState}
            checked={!!isSelectedCtrl.field.value}
          />
        </div>
        <div tw="flex-auto flex flex-col md:flex-row gap-6">
          <div tw="flex-auto">
            <TextInput
              {...keyCtrl.field}
              {...keyCtrl.fieldState}
              label={`Key #${index + 1}`}
              placeholder="AAAAB3NzaC1yc2EAAAAB ... B3NzaaC1=="
              disabled={!isNew}
            />
          </div>
          <div tw="md:w-4/12">
            <TextInput
              {...labelCtrl.field}
              {...labelCtrl.fieldState}
              label={`Label`}
              placeholder="cp@aleph.im"
              disabled={!isNew}
            />
          </div>
          {allowRemove && (
            <div tw="w-14 flex items-end md:justify-center pb-2">
              {isNew && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
})
SSHKeyItem.displayName = 'SSHKeyItem'

export const AddSSHKeys = React.memo((props: AddSSHKeysProps) => {
  const { name, control, fields, handleAdd, handleRemove, allowRemove } =
    useAddSSHKeys(props)

  return (
    <>
      {fields.length > 0 && (
        <NoisyContainer $type="dark">
          <div tw="flex flex-col gap-x-6 gap-y-4">
            {fields.map((field, index) => (
              <SSHKeyItem
                key={field.id}
                {...{
                  name,
                  index,
                  control,
                  allowRemove,
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
          Add SSH key
        </Button>
      </div>
    </>
  )
})
AddSSHKeys.displayName = 'AddSSHKeys'

export default AddSSHKeys
