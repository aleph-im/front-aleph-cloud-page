import {
  UseNewComputeResourceNodeFormReturn,
  useNewComputeResourceNodeForm,
} from '@/hooks/form/node/useNewComputeResourceNodeForm'

export type UseNewComputeResourceNodePage = UseNewComputeResourceNodeFormReturn

export function useNewComputeResourceNodePage(): UseNewComputeResourceNodePage {
  return useNewComputeResourceNodeForm()
}
