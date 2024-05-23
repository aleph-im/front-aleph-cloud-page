import { WebsiteFolderField } from '@/hooks/form/useAddWebsiteFolder'
import { Control } from 'react-hook-form'

export type RemoveWebsiteFolderProps = {
  onRemove: () => void
}

export type AddWebsiteFolderProps = {
  name?: string
  index?: number
  control: Control
  onRemove?: (index?: number) => void
  defaultValue?: WebsiteFolderField
}
