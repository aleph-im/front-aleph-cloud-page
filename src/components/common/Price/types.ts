import { StreamDurationUnit } from '@/hooks/form/useSelectStreamDuration'
import { HTMLAttributes } from 'react'

export type LabelVariant = 'success' | 'warning' | 'error'

export type PriceProps = HTMLAttributes<HTMLSpanElement> & {
  value: number | undefined
  duration?: StreamDurationUnit
}
