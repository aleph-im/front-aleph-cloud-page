import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useHashToEntityType } from '../../../../../hooks/common/useHashToEntityType'
import { EntityType } from '@/helpers/constants'

export type UseDashboardManagePageReturn = {
  type: EntityType | undefined
}

export function useDashboardManagePage(): UseDashboardManagePageReturn {
  const router = useRouter()
  const { hash } = router.query

  useEffect(() => {
    if (!hash || typeof hash !== 'string') router.replace('../')
  }, [hash, router])

  const type = useHashToEntityType(hash as string)
  return { type }
}
