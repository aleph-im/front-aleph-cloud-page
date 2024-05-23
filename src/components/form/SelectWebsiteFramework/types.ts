import { WebsiteFramework } from '@/domain/website'
import { Control } from 'react-hook-form'

export type SelectWebsiteFrameworkProps = {
  name?: string
  control: Control
  options?: WebsiteFramework[]
}
