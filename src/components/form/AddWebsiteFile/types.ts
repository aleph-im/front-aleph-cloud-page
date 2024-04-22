import { WebsiteFileField } from '@/hooks/form/useAddWebsiteFile'
import { Control } from 'react-hook-form'

export type RemoveWebsiteFileProps = {
  onRemove: () => void
}

export type AddWebsiteFileProps = {
  name?: string
  index?: number
  control: Control
  onRemove?: (index?: number) => void
  defaultValue?: WebsiteFileField
}
