import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { SSHKey } from '@/domain/ssh'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'
import { useDispatchDeleteEntityAction } from '@/hooks/common/useDeleteEntityAction'
import Err from '@/helpers/errors'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { DefaultTheme, useTheme } from 'styled-components'

export type UseSSHKeyDetailReturn = {
  theme: DefaultTheme
  sshKey?: SSHKey
  handleCopyLabel: () => void
  handleCopyKey: () => void
  handleDelete: () => void
}

export type UseSSHKeyDetailProps = {
  sshKeyId: string
}

export function useSSHKeyDetail({
  sshKeyId,
}: UseSSHKeyDetailProps): UseSSHKeyDetailReturn {
  const theme = useTheme()
  const router = useRouter()
  const { dispatchDeleteEntity } = useDispatchDeleteEntityAction({
    entityName: 'ssh',
  })

  const { entities } = useRequestSSHKeys({ ids: sshKeyId })
  const [sshKey] = entities || []

  const handleCopyLabel = useCopyToClipboardAndNotify(sshKey?.label || '')
  const handleCopyKey = useCopyToClipboardAndNotify(sshKey?.key || '')

  const manager = useSSHKeyManager()
  const { next, stop, noti } = useCheckoutNotification({})

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!sshKey) throw Err.SSHKeyNotFound

    const iSteps = await manager.getDelSteps(sshKey)
    const nSteps = iSteps.map((i) => stepsCatalog[i])
    const steps = manager.delSteps(sshKey)

    try {
      while (true) {
        const { done } = await steps.next()
        if (done) {
          break
        }
        await next(nSteps)
      }

      dispatchDeleteEntity(sshKey.id)

      await router.replace('/console')
    } catch (e) {
      console.error(e)

      const text = (e as Error).message
      const cause = (e as Error)?.cause as string | Error | undefined
      const detail = typeof cause === 'string' ? cause : cause?.message

      noti?.add({
        variant: 'error',
        title: 'Error',
        text,
        detail,
      })
    } finally {
      await stop()
    }
  }, [dispatchDeleteEntity, manager, sshKey, next, router, stop, noti])

  return {
    sshKey,
    theme,
    handleCopyLabel,
    handleCopyKey,
    handleDelete,
  }
}
