import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMessageToEntityType } from './useMessageToEntityType'
import { EntityType } from '@/helpers/constants'

export type UseDashboardManagePageReturn = {
  type: EntityType
}

export function useDashboardManagePage() {
  useConnectedWard()

  const router = useRouter()
  const { hash } = router.query

  useEffect(() => {
    if (!hash || typeof hash !== 'string') router.replace('../')
  }, [hash, router])

  const type = useMessageToEntityType(hash as string)

  return { type }
}
