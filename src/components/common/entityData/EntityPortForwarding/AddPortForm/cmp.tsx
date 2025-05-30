import React, { memo } from 'react'
import { Button, Checkbox, Icon, TextInput } from '@aleph-front/core'
import { Text } from '@/components/pages/console/common'
import { AddPortFormProps } from './types'
import { useAddPortForm, usePortItem, UsePortItemProps } from './hook'

const PortItem = React.memo(
  (props: UsePortItemProps & { disabled?: boolean }) => {
    const { portCtrl, tcpCtrl, udpCtrl, handleRemove } = usePortItem(props)

    return (
      <div tw="mt-2 px-4 py-3 w-fit" className="bg-background">
        <div tw="flex gap-4 items-center">
          <div tw="flex flex-col gap-3">
            <Text>Port</Text>
            <TextInput
              {...portCtrl.field}
              {...portCtrl.fieldState}
              placeholder="8080"
              required
            />
          </div>
          <div tw="flex flex-col gap-3">
            <Text>TCP</Text>
            <Checkbox {...tcpCtrl.field} {...tcpCtrl.fieldState} />
          </div>
          <div tw="flex flex-col gap-3">
            <Text>UDP</Text>
            <Checkbox {...udpCtrl.field} {...udpCtrl.fieldState} />
          </div>
          <div tw="self-end mb-1">
            <Button
              type="button"
              variant="warning"
              kind="functional"
              onClick={handleRemove}
              disabled={props.disabled}
            >
              <Icon name="trash-xmark" />
            </Button>
          </div>
        </div>
      </div>
    )
  },
)
PortItem.displayName = 'PortItem'

export const AddPortForm = ({ onSubmit, onCancel }: AddPortFormProps) => {
  const { name, control, handleSubmit, fields, addPortField, removePortField } =
    useAddPortForm({ onSubmit })

  return (
    <form onSubmit={handleSubmit} tw="mt-2">
      {fields.map((field, index) => (
        <PortItem
          key={field.id}
          {...{
            name,
            index,
            control,
            onRemove: removePortField,
            disabled: fields.length === 1,
          }}
        />
      ))}
      <div tw="mt-4 flex gap-2">
        <Button
          type="button"
          variant="secondary"
          kind="gradient"
          onClick={addPortField}
        >
          Add Port
        </Button>
        <Button type="submit" variant="primary" kind="gradient">
          Save
        </Button>
        <Button type="button" variant="tertiary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
AddPortForm.displayName = 'AddPortForm'

export default memo(AddPortForm)
