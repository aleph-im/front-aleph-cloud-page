import { useCallback } from 'react'
import { useCopyToClipboardAndNotify } from './useCopyToClipboard'
import { AnyEntity } from '@/helpers/utils'

export function useCopyHash(entity: AnyEntity) {
  const [, copyAndNotify] = useCopyToClipboardAndNotify()
  const handleCopyHash = useCallback(() => {
    copyAndNotify(entity?.id || '')
  }, [copyAndNotify, entity])
  return handleCopyHash
}
