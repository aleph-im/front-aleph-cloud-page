import React from 'react'
import {
  Icon,
  TextInput,
  Button,
  Checkbox,
  FormError,
  TextGradient,
} from '@aleph-front/core'
import { useAddSSHKeys, useSSHKeyItem } from '@/hooks/form/useAddSSHKeys'
import { SSHKeyItemProps, AddSSHKeysProps } from './types'
import { NoisyContainer } from '@aleph-front/core'

const SSHKeyItem = React.memo((props: SSHKeyItemProps) => {
  const {
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
              required
              label={`Key`}
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
                  kind="default"
                  size="md"
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

  const existingKeys = fields
    .map((field, index) => ({ ...field, index }))
    .filter((field) => !field.isNew)

  const newKeys = fields
    .map((field, index) => ({ ...field, index }))
    .filter((field) => !!field.isNew)

  console.log(existingKeys, newKeys)

  return (
    <>
      {fields.length > 0 && (
        <NoisyContainer>
          <div tw="flex flex-col gap-10 pb-6">
            {existingKeys.length > 0 && (
              <div tw="flex flex-col gap-6">
                <TextGradient forwardedAs="h3" type="h7" tw="mb-0 self-start">
                  Existing key list
                </TextGradient>
                {existingKeys.map((field) => (
                  <SSHKeyItem
                    key={field.id}
                    {...{
                      name,
                      index: field.index,
                      control,
                      allowRemove: true,
                      defaultValue: field,
                      onRemove: handleRemove,
                    }}
                  />
                ))}
              </div>
            )}
            {newKeys.length > 0 && (
              <div tw="flex flex-col gap-6">
                <TextGradient forwardedAs="h3" type="h7" tw="mb-0 self-start">
                  New keys
                </TextGradient>
                {newKeys.map((field) => (
                  <SSHKeyItem
                    key={field.id}
                    {...{
                      name,
                      index: field.index,
                      control,
                      allowRemove,
                      defaultValue: field,
                      onRemove: handleRemove,
                    }}
                  />
                ))}
              </div>
            )}
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
          Add SSH key
        </Button>
      </div>
    </>
  )
})
AddSSHKeys.displayName = 'AddSSHKeys'

export default AddSSHKeys
