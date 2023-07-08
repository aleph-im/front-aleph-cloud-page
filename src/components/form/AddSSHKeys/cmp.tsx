import React from 'react'
import { Icon, TextInput, Button, Checkbox } from '@aleph-front/aleph-core'
import { useAddSSHKeys, useSSHKeyItem } from '@/hooks/form/useAddSSHKeys'
import { SSHKeyItemProps, AddSSHKeysProps } from './types'
import NoisyContainer from '@/components/common/NoisyContainer'

const SSHKeyItem = React.memo(
  ({ index, allowRemove, ...props }: SSHKeyItemProps) => {
    const {
      id,
      sshKey,
      handleIsSelectedChange,
      handleKeyChange,
      handleLabelChange,
      handleRemove,
    } = useSSHKeyItem(props)

    return (
      <div tw="flex gap-6">
        <div tw="flex items-start pt-11">
          <Checkbox
            name={`${id}_selected`}
            checked={sshKey.isSelected}
            onChange={handleIsSelectedChange}
            disabled={sshKey.isNew}
          />
        </div>
        <div tw="flex-auto flex flex-col md:flex-row gap-6">
          <div tw="flex-auto">
            <TextInput
              name={`${id}_key`}
              label={`Key #${index + 1}`}
              placeholder="AAAAB3NzaC1yc2EAAAAB ... B3NzaaC1=="
              value={sshKey.key}
              onChange={handleKeyChange}
              disabled={!sshKey.isNew}
            />
          </div>
          <div tw="md:w-4/12">
            <TextInput
              name={`${id}_label`}
              label={`Label`}
              placeholder="cp@aleph.im"
              value={sshKey.label}
              onChange={handleLabelChange}
              disabled={!sshKey.isNew}
            />
          </div>
          {allowRemove && (
            <div tw="w-14 flex items-end md:justify-center pb-2">
              {sshKey.isNew && (
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
    )
  },
)
SSHKeyItem.displayName = 'SSHKeyItem'

export const AddSSHKeys = React.memo(
  ({ sshKeys: sshKeysProp, onChange }: AddSSHKeysProps) => {
    const { sshKeys, handleChange, handleAdd, handleRemove, allowRemove } =
      useAddSSHKeys({
        sshKeys: sshKeysProp,
        onChange,
      })

    return (
      <>
        {sshKeys.length > 0 && (
          <NoisyContainer>
            <div tw="flex flex-col gap-x-6 gap-y-4">
              {sshKeys.map((sshKey, index) => (
                <SSHKeyItem
                  key={sshKey.id}
                  sshKey={sshKey}
                  index={index}
                  onChange={handleChange}
                  onRemove={handleRemove}
                  allowRemove={allowRemove}
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
  },
)
AddSSHKeys.displayName = 'AddSSHKeys'

export default AddSSHKeys
