import { StreamDurationUnit } from '@/hooks/form/useSelectStreamDuration'
import { HTMLAttributes } from 'react'

export type PriceType = 'token' | 'credit'

export type PriceProps = HTMLAttributes<HTMLSpanElement> & {
  value: number | undefined
  type?: PriceType
  duration?: StreamDurationUnit
  iconSize?: string
  loading?: boolean
  decimals?: number
}
