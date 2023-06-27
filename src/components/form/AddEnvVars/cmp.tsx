import React from 'react'
import { Icon, TextInput, Button } from '@aleph-front/aleph-core'
import { useAddEnvVars, useEnvVarItem } from '@/hooks/form/useAddEnvVars'
import NoisyContainer from '../../NoisyContainer'
import { EnvVarItemProps, AddEnvVarProps } from './types'

const EnvVarItem = React.memo((props: EnvVarItemProps) => {
  const { id, envVar, handleNameChange, handleValueChange, handleRemove } =
    useEnvVarItem(props)

  return (
    <div tw="flex flex-col md:flex-row gap-6">
      <div tw="flex-1">
        <TextInput
          name={`${id}_name`}
          placeholder="Name"
          value={envVar.name}
          onChange={handleNameChange}
        />
      </div>
      <div tw="flex-1">
        <TextInput
          name={`${id}_value`}
          placeholder="Value"
          value={envVar.value}
          onChange={handleValueChange}
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

export default function AddEnvVars({
  envVars: envVarsProp,
  onChange,
}: AddEnvVarProps) {
  const { envVars, handleChange, handleAdd, handleRemove } = useAddEnvVars({
    envVars: envVarsProp,
    onChange,
  })

  return (
    <>
      {envVars.length > 0 && (
        <NoisyContainer>
          <div tw="flex flex-col gap-x-6 gap-y-4">
            <p tw="-mb-2">Set</p>
            {envVars.map((envVar) => (
              <EnvVarItem
                key={envVar.id}
                envVar={envVar}
                onChange={handleChange}
                onRemove={handleRemove}
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
}
