import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useCopyToClipboardAndNotify } from '@aleph-front/core'
import { SSHKey } from '@/domain/ssh'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { useAppState } from '@/contexts/appState'
import { useRequestSSHKeys } from '@/hooks/common/useRequestEntity/useRequestSSHKeys'
import { EntityDelAction } from '@/store/entity'
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
  const [, dispatch] = useAppState()
  const router = useRouter()

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

      dispatch(new EntityDelAction({ name: 'ssh', keys: [sshKey.id] }))

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
  }, [dispatch, manager, sshKey, next, router, stop, noti])

  return {
    sshKey,
    theme,
    handleCopyLabel,
    handleCopyKey,
    handleDelete,
  }
}
