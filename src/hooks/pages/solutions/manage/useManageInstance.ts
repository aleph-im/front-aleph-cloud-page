import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Instance } from '@/domain/instance'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useSSHKeyManager } from '@/hooks/common/useManager/useSSHKeyManager'
import { SSHKey } from '@/domain/ssh'
import { useRequestInstances } from '@/hooks/common/useRequestEntity/useRequestInstances'
import { TabsProps, useCopyToClipboardAndNotify } from '@aleph-front/core'
import { DefaultTheme, useTheme } from 'styled-components'
import {
  UseExecutableActionsReturn,
  useExecutableActions,
} from '@/hooks/common/useExecutableActions'

export type ManageInstance = UseExecutableActionsReturn & {
  instance?: Instance
  mappedKeys: (SSHKey | undefined)[]
  theme: DefaultTheme
  tabs: TabsProps['tabs']
  tabId: string
  setTabId: (tabId: string) => void
  handleCopyHash: () => void
  handleCopyConnect: () => void
  handleCopyIpv6: () => void
  handleDelete: () => void
  handleBack: () => void
}

export function useManageInstance(): ManageInstance {
  const router = useRouter()
  const { hash } = router.query

  const { entities } = useRequestInstances({ ids: hash as string })
  const [instance] = entities || []

  const manager = useInstanceManager()

  const theme = useTheme()

  const [tabId, setTabId] = useState('detail')
  const subscribeLogs = tabId === 'log'

  const executableActions = useExecutableActions({
    executable: instance,
    manager,
    subscribeLogs,
  })

  const { logsDisabled, status } = executableActions

  const tabs = useMemo(
    () =>
      [
        {
          id: 'detail',
          name: 'Details',
        },
        {
          id: 'log',
          name: 'Logs',
          disabled: logsDisabled,
        },
      ] as TabsProps['tabs'],
    [logsDisabled],
  )

  const [mappedKeys, setMappedKeys] = useState<(SSHKey | undefined)[]>([])

  const handleCopyHash = useCopyToClipboardAndNotify(instance?.id || '')
  const handleCopyIpv6 = useCopyToClipboardAndNotify(status?.ipv6Parsed || '')
  const handleCopyConnect = useCopyToClipboardAndNotify(
    `ssh root@${status?.ipv6Parsed}`,
  )

  const sshKeyManager = useSSHKeyManager()

  useEffect(() => {
    if (!instance || !sshKeyManager) return
    const getMapped = async () => {
      const mapped = await sshKeyManager?.getByValues(
        instance.authorized_keys || [],
      )
      setMappedKeys(mapped)
    }

    getMapped()
  }, [sshKeyManager, instance])

  const handleEnsureNetwork = useCallback(async () => {
    let superfluidAccount
    if (!instance) return

    if (isPAYG) {
      if (
        blockchain !== BlockchainId.AVAX ||
        !(account instanceof AvalancheAccount)
      ) {
        handleConnect({ blockchain: BlockchainId.AVAX })
        throw Err.ConnectYourPaymentWallet
      }
      // @note: refactor in SDK calling init inside this method
      superfluidAccount = createFromAvalancheAccount(account)
      await superfluidAccount.init()

      return superfluidAccount
    } else if (blockchain !== BlockchainId.ETH) {
      handleConnect({ blockchain: BlockchainId.ETH })
      throw Err.ConnectYourPaymentWallet
    }
  }, [account, blockchain, handleConnect, instance, isPAYG])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!instance) throw Err.InstanceNotFound

    try {
      const superfluidAccount = await handleEnsureNetwork()

      const iSteps = await manager.getDelSteps(instance)
      const nSteps = iSteps.map((i) => stepsCatalog[i])
      const steps = manager.delSteps(instance, superfluidAccount)

      while (true) {
        const { done } = await steps.next()
        if (done) {
          break
        }
        await next(nSteps)
      }

      dispatch(new EntityDelAction({ name: 'instance', keys: [instance.id] }))

      await router.replace('/')
    } catch (e) {
    } finally {
      await stop()
    }
  }, [dispatch, handleEnsureNetwork, instance, manager, next, router, stop])

  const noti = useNotification()

  const [crn, setCRN] = useState<CRN>()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setCRN(undefined)

      if (!manager) return
      if (!instance) return

      const node = await manager.getAllocationCRN(instance)
      if (cancelled) return

      setCRN(node)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [instance, manager])

  const nodeDetails = useMemo(() => {
    if (!crn) return
    return {
      name: crn.name || crn.hash,
      url: crn.address || '',
    }
  }, [crn])

  const nodeUrl = useMemo(() => {
    const { url = '' } = nodeDetails || {}
    return NodeManager.normalizeUrl(url)
  }, [nodeDetails])

  const handleSendOperation = useCallback(
    async (operation: ExecutableOperations) => {
      try {
        if (!manager) throw Err.ConnectYourWallet
        if (!nodeUrl) throw Err.InvalidNode
        if (!instanceId) throw Err.InvalidNode

        const keyPair = await manager.getKeyPair()
        const authPubkey = await manager.getAuthPubkeyToken({
          url: nodeUrl,
          keyPair,
        })

        await manager.sendPostOperation({
          hostname: nodeUrl,
          operation,
          keyPair,
          authPubkey,
          vmId: instanceId,
        })
      } catch (e) {
        noti?.add({
          variant: 'error',
          title: 'Error',
          text: (e as Error)?.message,
        })
      }
    },
    [manager, nodeUrl, noti, instanceId],
  )

  const handleRetryAllocation = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!instance) throw Err.InstanceNotFound
    if (!isPAYG) throw Err.StreamNotSupported

    try {
      await handleEnsureNetwork()
      if (!crn) throw Err.ConnectYourPaymentWallet

      await manager.notifyCRNExecution(crn, instance.id)
    } catch (e) {
      noti?.add({
        variant: 'error',
        title: 'Error',
        text: (e as Error)?.message,
      })
    }
  }, [crn, handleEnsureNetwork, instance, isPAYG, manager, noti])

  const isRunning = !!status?.ipv6Parsed

  const stopDisabled = !isPAYG || !isRunning || !crn
  const startDisabled = !isPAYG || isRunning || !crn
  const rebootDisabled = !isRunning || !crn

  const handleStop = useCallback(
    () => handleSendOperation('stop'),
    [handleSendOperation],
  )

  const handleStart = handleRetryAllocation

  const handleReboot = useCallback(
    () => handleSendOperation('reboot'),
    [handleSendOperation],
  )

  // const { logs } = useRequestExecutableLogsFeed({ nodeUrl, vmId: instanceId })
  const logs = ''

  const handleBack = () => {
    router.push('.')
  }

  return {
    ...executableActions,
    instance,
    mappedKeys,
    theme,
    tabs,
    tabId,
    setTabId,
    handleCopyHash,
    handleCopyConnect,
    handleCopyIpv6,
    handleDelete,
    handleBack,
  }
}
