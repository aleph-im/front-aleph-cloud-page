import { useCallback, useMemo } from 'react'
import { useNotification } from '@aleph-front/core'
import { Instance, InstanceManager } from '@/domain/instance'
import { NodeManager } from '@/domain/node'
import {
  ExecutableCalculatedStatus,
  ExecutableStatus,
} from '@/domain/executable'
import Err from '@/helpers/errors'
import { PaymentType } from '@aleph-sdk/message'
import { BlockchainId, blockchains } from '@/domain/connect'
import { useAppState } from '@/contexts/appState'
import { createFromEVMAccount } from '@aleph-sdk/superfluid'
import {
  stepsCatalog,
  useCheckoutNotification,
} from '@/hooks/form/useCheckoutNotification'
import { EntityAddAction } from '@/store/entity'
import { useDispatchDeleteEntityAction } from '@/hooks/common/useDeleteEntityAction'
import { useRouter } from 'next/router'
import { isAccountPAYGCompatible } from '@/domain/account'
import { EVMAccount } from '@aleph-sdk/evm'
import { NAVIGATION_URLS } from '@/helpers/constants'
import { calculateExecutableStatus } from '@/helpers/executableStatus'
import { BoostPollingOptions } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'

export type UseInstanceRowActionsProps = {
  instance: Instance
  manager?: InstanceManager
  status?: ExecutableStatus
  statusLoading?: boolean
  triggerBoostPolling?: (options: BoostPollingOptions) => void
}

export type UseInstanceRowActionsReturn = {
  calculatedStatus: ExecutableCalculatedStatus
  stopDisabled: boolean
  startDisabled: boolean
  rebootDisabled: boolean
  deleteDisabled: boolean
  handleStop: () => void
  handleStart: () => void
  handleReboot: () => void
  handleDelete: () => void
}

export function useInstanceRowActions({
  instance,
  manager,
  status,
  statusLoading,
  triggerBoostPolling,
}: UseInstanceRowActionsProps): UseInstanceRowActionsReturn {
  const isPAYG = instance?.payment?.type === PaymentType.superfluid
  const router = useRouter()
  const noti = useNotification()

  const [state, dispatch] = useAppState()
  const { account, blockchain } = state.connection

  const { dispatchDeleteEntity } = useDispatchDeleteEntityAction({
    entityName: instance?.type || '',
  })

  const { next, stop } = useCheckoutNotification({})

  // Calculate status
  const hasTriedFetching = !statusLoading && status !== undefined
  const calculatedStatus = useMemo(
    () => calculateExecutableStatus(hasTriedFetching, status, instance?.type),
    [hasTriedFetching, status, instance?.type],
  )

  const isRunning = calculatedStatus === 'running' || calculatedStatus === 'v1'
  const isStopped =
    calculatedStatus === 'stopped' || calculatedStatus === 'not-allocated'

  // Check network compatibility
  const checkNetworkCompatibility = useCallback(
    (requiredBlockchain?: BlockchainId): string | undefined => {
      if (!requiredBlockchain || requiredBlockchain === blockchain)
        return undefined
      const networkInfo = blockchains[requiredBlockchain]
      return networkInfo?.name || requiredBlockchain.toString()
    },
    [blockchain],
  )

  // Get CRN and send operation
  const sendOperation = useCallback(
    async (operation: 'stop' | 'reboot') => {
      if (!manager) throw Err.ConnectYourWallet
      if (!instance) throw Err.InstanceNotFound

      // Get CRN allocation
      const crn = await manager.getAllocationCRN(instance)
      if (!crn) throw Err.InvalidNode

      const nodeUrl = NodeManager.normalizeUrl(crn.address || '')
      if (!nodeUrl) throw Err.InvalidNode

      await manager.sendPostOperation({
        hostname: nodeUrl,
        operation,
        vmId: instance.id,
      })
    },
    [manager, instance],
  )

  const handleStop = useCallback(async () => {
    try {
      await sendOperation('stop')
      noti?.add({
        variant: 'success',
        title: 'Stop requested',
        text: 'The instance is being stopped',
      })

      // Trigger boost polling with enforced "stopping" status
      triggerBoostPolling?.({
        entityId: instance.id,
        enforcedStatus: 'stopping',
        expectedStatuses: ['stopped'],
      })
    } catch (e) {
      noti?.add({
        variant: 'error',
        title: 'Error',
        text: (e as Error)?.message,
      })
    }
  }, [sendOperation, noti, triggerBoostPolling, instance?.id])

  const handleStart = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!instance) throw Err.InstanceNotFound
    if (!isPAYG) {
      noti?.add({
        variant: 'error',
        title: 'Error',
        text: 'Start is only available for PAYG instances',
      })
      return
    }

    try {
      const instanceNetwork = instance.payment?.chain
      const incompatibleNetwork = checkNetworkCompatibility(instanceNetwork)

      if (incompatibleNetwork) {
        throw Err.NetworkMismatch(incompatibleNetwork)
      }

      if (!isAccountPAYGCompatible(account)) {
        throw Err.ConnectYourPaymentWallet
      }

      const crn = await manager.getAllocationCRN(instance)
      if (!crn) throw Err.InvalidNode

      await manager.notifyCRNAllocation(crn, instance.id)

      noti?.add({
        variant: 'success',
        title: 'Start requested',
        text: 'The instance is being started',
      })

      // Trigger boost polling with enforced "starting" status
      triggerBoostPolling?.({
        entityId: instance.id,
        enforcedStatus: 'starting',
        expectedStatuses: ['running'],
      })
    } catch (e) {
      noti?.add({
        variant: 'error',
        title: 'Error',
        text: (e as Error)?.message,
      })
    }
  }, [
    manager,
    instance,
    isPAYG,
    checkNetworkCompatibility,
    account,
    noti,
    triggerBoostPolling,
  ])

  const handleReboot = useCallback(async () => {
    try {
      await sendOperation('reboot')
      noti?.add({
        variant: 'success',
        title: 'Reboot requested',
        text: 'The instance is being rebooted',
      })

      // Trigger boost polling with enforced "rebooting" status
      // Rebooting doesn't have a specific expected status, so we let it poll until max
      triggerBoostPolling?.({
        entityId: instance.id,
        enforcedStatus: 'rebooting',
      })
    } catch (e) {
      noti?.add({
        variant: 'error',
        title: 'Error',
        text: (e as Error)?.message,
      })
    }
  }, [sendOperation, noti, triggerBoostPolling, instance?.id])

  const handleDelete = useCallback(async () => {
    if (!manager) throw Err.ConnectYourWallet
    if (!instance) throw Err.InstanceNotFound

    try {
      const instanceNetwork = instance.payment?.chain
      const incompatibleNetwork = checkNetworkCompatibility(instanceNetwork)

      if (incompatibleNetwork) {
        throw Err.NetworkMismatch(incompatibleNetwork)
      }

      if (isPAYG && !isAccountPAYGCompatible(account)) {
        throw Err.ConnectYourPaymentWallet
      }

      const superfluidAccount = isPAYG
        ? await createFromEVMAccount(account as EVMAccount)
        : undefined

      // Optimistic deletion
      dispatchDeleteEntity(instance.id)

      try {
        const iSteps = await manager.getDelSteps(instance)
        const nSteps = iSteps.map((i) => stepsCatalog[i])
        const steps = manager.delSteps(instance, superfluidAccount)

        while (true) {
          const { done } = await steps.next()
          if (done) break
          await next(nSteps)
        }
      } catch (deletionError) {
        // Rollback on failure
        dispatch(
          new EntityAddAction({
            name: instance.type,
            entities: [instance],
          }),
        )
        throw deletionError
      }

      await router.replace(NAVIGATION_URLS.console.home)
    } catch (e) {
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
  }, [
    manager,
    instance,
    isPAYG,
    checkNetworkCompatibility,
    account,
    dispatchDeleteEntity,
    dispatch,
    next,
    router,
    stop,
    noti,
  ])

  // Compute disabled states
  const stopDisabled = useMemo(() => {
    if (!isPAYG) return true
    return !isRunning
  }, [isPAYG, isRunning])

  const startDisabled = useMemo(() => {
    return !isStopped
  }, [isStopped])

  const rebootDisabled = useMemo(() => {
    return !isRunning
  }, [isRunning])

  const deleteDisabled = useMemo(() => {
    return !instance
  }, [instance])

  return {
    calculatedStatus,
    stopDisabled,
    startDisabled,
    rebootDisabled,
    deleteDisabled,
    handleStop,
    handleStart,
    handleReboot,
    handleDelete,
  }
}
