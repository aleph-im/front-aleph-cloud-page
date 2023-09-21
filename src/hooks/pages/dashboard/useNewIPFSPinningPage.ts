import { FileManager } from '@/domain/file'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { defaultValues } from './useNewDomainPage'
import { useCallback } from 'react'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useRouter } from 'next/router'
import { useAppState } from '@/contexts/appState'

export type NewIPFSPinningFormState = {
  cid: string
  name: string
}

export function useNewIPFSPinningPage() {
  useConnectedWard()

  const router = useRouter()
  const [appState, dispatch] = useAppState()
  const { account, accountBalance } = appState
  const onSubmit = useCallback()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(FileManager.addSchema),
  })
  const values = useWatch({ control }) as NewIPFSPinningFormState

  return {
    control,
    handleSubmit,
    errors,
    values,
  }
}
