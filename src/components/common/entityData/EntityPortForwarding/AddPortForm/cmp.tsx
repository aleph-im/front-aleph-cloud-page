import React, { memo } from 'react'
import { Button, Checkbox, Icon, TextInput } from '@aleph-front/core'
import { Text } from '@/components/pages/console/common'
import { AddPortFormProps } from './types'
import { useAddPortForm, usePortItem, UsePortItemProps } from './hook'

const PortItem = React.memo((props: UsePortItemProps) => {
  const { portCtrl, tcpCtrl, udpCtrl, handleRemove } = usePortItem(props)

  return (
    <div tw="flex gap-6 items-center flex-wrap">
      <div tw="flex flex-col gap-3">
        <Text>Port</Text>
        <TextInput
          {...portCtrl.field}
          {...portCtrl.fieldState}
          placeholder="8080"
          required
          width="6em"
          textAlign="center"
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
      <div tw="self-end">
        <Button
          type="button"
          variant="warning"
          kind="functional"
          onClick={handleRemove}
        >
          <Icon name="trash-xmark" />
        </Button>
      </div>
    </div>
  )
})
PortItem.displayName = 'PortItem'

export const AddPortForm = ({ onSubmit, onCancel }: AddPortFormProps) => {
  const { name, control, handleSubmit, fields, addPortField, removePortField } =
    useAddPortForm({ onSubmit, onCancel })

  return (
    <form onSubmit={handleSubmit} tw="flex flex-col gap-y-4">
      {fields.map((field, index) => (
        <PortItem
          key={field.id}
          {...{
            name,
            index,
            control,
            onRemove: removePortField,
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
      </div>
    </form>
  )
}
AddPortForm.displayName = 'AddPortForm'

export default memo(AddPortForm)
