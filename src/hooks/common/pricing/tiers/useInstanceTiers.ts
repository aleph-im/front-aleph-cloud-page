import { CRNSpecs, ReducedCRNSpecs } from '@/domain/node'
import { PaymentMethod } from '@/helpers/constants'
import { useMemo } from 'react'
import { useNodeManager } from '../../useManager/useNodeManager'
import { useDefaultTiers } from './useDefaultTiers'

export type InstanceTier = ReducedCRNSpecs & {
  disabled?: boolean
}

export type UseInstanceTiersProps = {
  paymentMethod?: PaymentMethod
  nodeSpecs?: CRNSpecs
}

export type UseInstanceTiersReturn = {
  tiers: InstanceTier[]
}

export function useInstanceTiers({
  paymentMethod = PaymentMethod.Hold,
  nodeSpecs,
}: UseInstanceTiersProps): UseInstanceTiersReturn {
  const manager = useNodeManager()
  const { defaultTiers } = useDefaultTiers({ type: 'instance' })

  const instanceTiers = useMemo(() => {
    if (paymentMethod === PaymentMethod.Hold) return defaultTiers
    if (!nodeSpecs) return []

    return defaultTiers.filter((tier) =>
      manager.validateMinNodeSpecs(tier, nodeSpecs),
    )
  }, [defaultTiers, manager, nodeSpecs, paymentMethod])

  return { tiers: instanceTiers }
}
