import {
  WebsiteFramework,
  WebsiteFrameworkId,
  WebsiteFrameworks,
} from '@/domain/website'
import { useMemo } from 'react'
import { Control, UseControllerReturn, useController } from 'react-hook-form'

export type WebsiteFrameworkField = {
  framework: WebsiteFrameworkId
}

export const defaultWebsiteFramework: WebsiteFrameworkField = {
  framework: WebsiteFrameworkId.none,
}

export const defaultWebsiteFrameworkOptions = Object.values(WebsiteFrameworks)

export type UseSelectWebsiteFrameworkProps = {
  name?: string
  control: Control
  defaultValue?: WebsiteFrameworkField
  options?: WebsiteFramework[]
}

export type UseSelectWebsiteFrameworkReturn = {
  frameworkCtrl: UseControllerReturn<any, any>
  options: WebsiteFramework[]
  docs?: WebsiteFramework['docs']
}

export function useSelectWebsiteFramework({
  name = '',
  control,
  defaultValue,
  options: optionsProp,
}: UseSelectWebsiteFrameworkProps): UseSelectWebsiteFrameworkReturn {
  const options = optionsProp || defaultWebsiteFrameworkOptions

  const frameworkCtrl = useController({
    control,
    name: `${name}.framework`,
    defaultValue: defaultValue?.framework,
  })

  const docs = useMemo(
    () =>
      WebsiteFrameworks[frameworkCtrl.field.value as WebsiteFrameworkId]?.docs,
    [frameworkCtrl.field.value],
  )

  return {
    frameworkCtrl,
    options,
    docs,
  }
}
