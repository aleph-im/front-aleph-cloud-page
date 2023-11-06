import React from 'react'
import { Icon, TextInput, Button } from '@aleph-front/aleph-core'
import { useAddEnvVars, useEnvVarItem } from '@/hooks/form/useAddEnvVars'
import { EnvVarItemProps, AddEnvVarsProps as AddEnvVarsProps } from './types'
import NoisyContainer from '@/components/common/NoisyContainer'

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
EnvVarItem.displayName = 'EnvVarItem'

export const AddEnvVars = React.memo((props: AddEnvVarsProps) => {
  const { name, control, fields, handleAdd, handleRemove } =
    useAddEnvVars(props)

  return (
    <>
      {fields.length > 0 && (
        <NoisyContainer $type="dark">
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
          Add var
        </Button>
      </div>
    </>
  )
})
AddEnvVars.displayName = 'AddEnvVars'

export default AddEnvVars
