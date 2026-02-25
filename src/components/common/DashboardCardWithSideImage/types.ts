import { ReactNode } from 'react'

export type DashboardCardWithSideImageProps = {
  info: string
  title: string
  description: ReactNode
  imageSrc: string
  imageAlt: string
  withButton?: boolean
  buttonUrl?: string
  buttonText?: string
  buttonIsExternal?: boolean
  externalLinkText?: string
  externalLinkUrl?: string
}
