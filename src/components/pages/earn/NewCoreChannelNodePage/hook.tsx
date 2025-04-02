import {
  UseNewCoreChannelNodeFormReturn,
  useNewCoreChannelNodeForm,
} from '@/hooks/form/node/useNewCoreChannelNodeForm'

export type UseNewCoreChannelNodePage = UseNewCoreChannelNodeFormReturn

export function useNewCoreChannelNodePage(): UseNewCoreChannelNodePage {
  return useNewCoreChannelNodeForm()
}
