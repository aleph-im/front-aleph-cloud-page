import { ChangeEvent, useCallback, useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type StreamDurationUnit = 'h' | 'd' | 'm' | 'y'

export type StreamDurationField = {
  duration: number
  unit: StreamDurationUnit
}

export function getHours(streamDuration: StreamDurationField): number {
  if (!streamDuration) return 0

  const { duration, unit } = streamDuration

  const unitMultiplier =
    unit === 'd'
      ? 24
      : unit === 'm'
      ? (365 / 12) * 24
      : unit === 'y'
      ? 365 * 24
      : 1

  return duration * unitMultiplier
}

export type UseSelectStreamDurationProps = {
  name?: string
  control: Control
  defaultValue?: StreamDurationField
}

export type UseSelectStreamDurationReturn = {
  durationCtrl: UseControllerReturn<any, any>
  unitCtrl: UseControllerReturn<any, any>
}

export const defaultStreamDuration: StreamDurationField = {
  duration: 1,
  unit: 'h',
}

export function useSelectStreamDuration({
  name = 'streamDuration',
  control,
  defaultValue,
  ...rest
}: UseSelectStreamDurationProps): UseSelectStreamDurationReturn {
  const durationCtrl = useController({
    control,
    name: `${name}.duration`,
    defaultValue: defaultValue?.duration,
  })

  const unitCtrl = useController({
    control,
    name: `${name}.unit`,
    defaultValue: defaultValue?.unit,
  })

  const { value, onChange } = durationCtrl.field

  durationCtrl.field.onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value
      onChange(Number(val))
    },
    [onChange],
  )

  durationCtrl.field.value = useMemo(() => {
    return value > 0 ? String(value) : ''
  }, [value])

  return {
    durationCtrl,
    unitCtrl,
    ...rest,
  }
}
