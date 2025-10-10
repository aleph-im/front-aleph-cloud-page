import {
  useEffect,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react'
import { useAccountEntities } from '@/hooks/common/useAccountEntities'
import { useInstanceManager } from '@/hooks/common/useManager/useInstanceManager'
import { useGpuInstanceManager } from '@/hooks/common/useManager/useGpuInstanceManager'
import { useConfidentialManager } from '@/hooks/common/useManager/useConfidentialManager'
import { PaymentMethod } from '@/helpers/constants'
import { useRequestExecutableStatus } from '@/hooks/common/useRequestEntity/useRequestExecutableStatus'
import { PaymentType } from '@aleph-sdk/message'
import { useConnection } from '@/hooks/common/useConnection'

export type UseCreditsDashboardReturn = {
  totalCostPerHour: number
  runRateDays: number
  creditsDashboardOpen: boolean
  setCreditsDashboardOpen: Dispatch<SetStateAction<boolean>>
  isConnected: boolean
  accountCreditBalance?: number
  isCalculatingCosts: boolean
}

export function useCreditsDashboard(): UseCreditsDashboardReturn {
  const [totalCostPerHour, setTotalCostPerHour] = useState(0)
  const [creditsDashboardOpen, setCreditsDashboardOpen] = useState(false)
  const [isCalculatingCosts, setIsCalculatingCosts] = useState(true)

  const { account, creditBalance: accountCreditBalance } = useConnection({
    triggerOnMount: false,
  })

  const isConnected = useMemo(() => !!account, [account])

  // Get all entities
  const { instances, gpuInstances, confidentials } = useAccountEntities()

  const creditInstances = useMemo(
    () =>
      instances.filter(
        (instance) => instance.payment?.type === PaymentType.credit,
      ),
    [instances],
  )
  const creditGpuInstances = useMemo(
    () =>
      gpuInstances.filter(
        (gpuInstance) => gpuInstance.payment?.type === PaymentType.credit,
      ),
    [gpuInstances],
  )
  const creditConfidentials = useMemo(
    () =>
      confidentials.filter(
        (confidential) => confidential.payment?.type === PaymentType.credit,
      ),
    [confidentials],
  )

  // Get managers
  const instanceManager = useInstanceManager()
  const gpuInstanceManager = useGpuInstanceManager()
  const confidentialManager = useConfidentialManager()

  // Get status for running entities
  const { status: creditInstancesStatus } = useRequestExecutableStatus({
    entities: creditInstances,
  })
  const { status: creditGpuInstancesStatus } = useRequestExecutableStatus({
    entities: creditGpuInstances,
  })
  const { status: creditConfidentialsStatus } = useRequestExecutableStatus({
    entities: creditConfidentials,
    managerHook: useConfidentialManager,
  })

  // Helper function to check if entity is running
  const isRunning = useCallback((entityId: string, status?: any) => {
    const statusData = status?.data

    return (
      statusData &&
      (statusData.vm_ipv6 || statusData.ipv6Parsed || statusData.ipv6)
    )
  }, [])

  // Helper function to calculate cost for a computing entity
  const calculateComputingEntityCost = useCallback(
    async (entityId: string, entityStatus: any, manager: any) => {
      try {
        if (isRunning(entityId, entityStatus) && manager) {
          const cost = await manager.getTotalCostByHash(
            PaymentMethod.Credit,
            entityId,
          )

          return cost
        } else {
          return 0
        }
      } catch (err) {
        console.error('Error calculating entity cost:', err)
        return 0
      }
    },
    [isRunning],
  )

  // Calculate total cost per hour
  useEffect(() => {
    async function calculateTotalCost() {
      setIsCalculatingCosts(true)

      try {
        let total = 0

        // Calculate costs for regular credit instances
        for (const instance of creditInstances) {
          total += await calculateComputingEntityCost(
            instance.id,
            creditInstancesStatus[instance.id],
            instanceManager,
          )
        }

        // Calculate costs for credit GPU instances
        for (const gpuInstance of creditGpuInstances) {
          total += await calculateComputingEntityCost(
            gpuInstance.id,
            creditGpuInstancesStatus[gpuInstance.id],
            gpuInstanceManager,
          )
        }

        // Calculate costs for credit confidential instances
        for (const confidential of creditConfidentials) {
          total += await calculateComputingEntityCost(
            confidential.id,
            creditConfidentialsStatus[confidential.id],
            confidentialManager,
          )
        }

        setTotalCostPerHour(total)
      } catch (err) {
        console.error('Error calculating total cost:', err)
      } finally {
        setIsCalculatingCosts(false)
      }
    }

    calculateTotalCost()
  }, [
    calculateComputingEntityCost,
    confidentialManager,
    creditConfidentials,
    creditConfidentialsStatus,
    creditGpuInstances,
    creditGpuInstancesStatus,
    creditInstances,
    creditInstancesStatus,
    gpuInstanceManager,
    instanceManager,
  ])

  // Calculate run rate days
  const runRateDays = useMemo(() => {
    if (
      !accountCreditBalance ||
      accountCreditBalance <= 0 ||
      totalCostPerHour <= 0
    ) {
      return 0
    }

    const totalCostPerDay = totalCostPerHour * 24
    return Math.floor(accountCreditBalance / totalCostPerDay)
  }, [accountCreditBalance, totalCostPerHour])

  // Handle dashboard open/close based on connection
  useEffect(() => {
    if (!isConnected && creditsDashboardOpen) {
      setCreditsDashboardOpen(false)
    }
  }, [isConnected, creditsDashboardOpen])

  return {
    totalCostPerHour,
    runRateDays,
    creditsDashboardOpen,
    setCreditsDashboardOpen,
    isConnected,
    accountCreditBalance,
    isCalculatingCosts,
  }
}
