import { ReactNode } from 'react'

export type CardWithSideImageProps = {
  children: ReactNode
  imageSrc: string
  imageAlt: string
  imagePosition: string
  cardBackgroundColor: string
  reverseColumnsWhenStacked: boolean
}
