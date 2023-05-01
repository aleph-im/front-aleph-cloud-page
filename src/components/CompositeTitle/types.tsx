import { TextGradientProps, TypoKind } from '@aleph-front/aleph-core'
import { ElementType } from 'react'

export type CompositeTitleProps = TextGradientProps & {
  number: number | string
  color?: string
  label?: string
  as?: ElementType
  disabled?: boolean
}

export type LabelProps = {
  type: TypoKind
}
