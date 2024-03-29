import React from 'react'
import { Icon, TextInput, Button } from '@aleph-front/core'
import { useAddEnvVars, useEnvVarItem } from '@/hooks/form/useAddEnvVars'
import { EnvVarItemProps, AddEnvVarsProps as AddEnvVarsProps } from './types'

const EnvVarItem = React.memo((props: EnvVarItemProps) => {
  const { nameCtrl, valueCtrl, handleRemove } = useEnvVarItem(props)

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
      <div tw="flex-1">
        <TextInput
          {...valueCtrl.field}
          {...valueCtrl.fieldState}
          required
          placeholder="Value"
        />
      </div>
      <div tw="flex items-end md:justify-center pb-2">
        <Button
          type="button"
          kind="functional"
          variant="warning"
          size="md"
          onClick={handleRemove}
        >
          <Icon name="trash" />
        </Button>
      </div>
    </div>
  )
})
EnvVarItem.displayName = 'EnvVarItem'

export const AddEnvVars = React.memo((props: AddEnvVarsProps) => {
  const { name, control, fields, handleAdd, handleRemove } =
    useAddEnvVars(props)

  return (
    <>
      {fields.length > 0 && (
        <div className="bg-base1" tw="p-6">
          <div tw="flex flex-col gap-x-6 gap-y-4">
            <p tw="-mb-2">Set</p>
            {fields.map((field, index) => (
              <EnvVarItem
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
      <div tw="mt-6 mx-6">
        <Button
          type="button"
          onClick={handleAdd}
          color="main0"
          variant="secondary"
          kind="default"
          size="md"
        >
          Add var
        </Button>
      </div>
    </>
  )
})
AddEnvVars.displayName = 'AddEnvVars'

export default AddEnvVars
