import { useCallback } from 'react'
import {
  Control,
  UseControllerReturn,
  useController,
  useFieldArray,
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from '@/hooks/common/useForm'
import { AddPortFormState, defaultAddPortFormState } from '../types'
import { UseAddPortFormProps, UseAddPortFormReturn } from './types'

const portSchema = z
  .object({
    port: z
      .string()
      .min(1, 'Port is required')
      .refine((val) => {
        const num = parseInt(val, 10)
        return !isNaN(num) && num > 0 && num <= 65535
      }, 'Port must be between 1 and 65535'),
    tcp: z.boolean(),
    udp: z.boolean(),
  })
  .refine(
    (data) => data.tcp || data.udp,
    'At least one protocol (TCP or UDP) must be selected',
  )

const addPortFormSchema = z.object({
  ports: z.array(portSchema).min(1, 'At least one port is required'),
})

export type UsePortItemProps = {
  name?: string
  index: number
  control: Control
  onRemove: (index: number) => void
}

export type UsePortItemReturn = {
  portCtrl: UseControllerReturn<any, any>
  tcpCtrl: UseControllerReturn<any, any>
  udpCtrl: UseControllerReturn<any, any>
  handleRemove: () => void
}

export function usePortItem({
  name = 'ports',
  index,
  control,
  onRemove,
}: UsePortItemProps): UsePortItemReturn {
  const portCtrl = useController({
    control,
    name: `${name}.${index}.port`,
  })

  const tcpCtrl = useController({
    control,
    name: `${name}.${index}.tcp`,
  })

  const udpCtrl = useController({
    control,
    name: `${name}.${index}.udp`,
  })

  const handleRemove = useCallback(() => {
    onRemove(index)
  }, [index, onRemove])

  return {
    portCtrl,
    tcpCtrl,
    udpCtrl,
    handleRemove,
  }
}

export function useAddPortForm({
  onSubmit: onSubmitProp,
}: UseAddPortFormProps): UseAddPortFormReturn {
  const name = 'ports'

  const onSubmit = useCallback(
    async (data: AddPortFormState) => {
      onSubmitProp(data.ports)
    },
    [onSubmitProp],
  )

  const { control, handleSubmit } = useForm<AddPortFormState, void>({
    defaultValues: defaultAddPortFormState,
    resolver: zodResolver(addPortFormSchema),
    onSubmit,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name,
    shouldUnregister: true,
  })

  const addPortField = useCallback(() => {
    append({ port: '', tcp: false, udp: false })
  }, [append])

  const removePortField = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index)
      }
    },
    [remove, fields.length],
  )

  return {
    name,
    control,
    fields,
    handleSubmit,
    addPortField,
    removePortField,
  }
}
