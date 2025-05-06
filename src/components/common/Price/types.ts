import { StreamDurationUnit } from '@/hooks/form/useSelectStreamDuration'
import { HTMLAttributes } from 'react'

export type PriceProps = HTMLAttributes<HTMLSpanElement> & {
  value: number | undefined
  duration?: StreamDurationUnit
  iconSize?: string
}
