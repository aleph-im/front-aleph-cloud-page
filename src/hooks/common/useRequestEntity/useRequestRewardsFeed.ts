import { useEffect, useMemo, useState } from 'react'
import { RewardsResponse, StakeManager } from '@/domain/stake'
import { useAppState } from '@/contexts/appState'
import { Future } from '@/helpers/utils'
import { RequestSetAction } from '@/store/request'

export type UseRequestRewardsFeedReturn = {
  lastRewardsDistribution?: RewardsResponse
  lastRewardsCalculation?: RewardsResponse
}

export function useRequestRewardsFeed(): UseRequestRewardsFeedReturn {
  const [state, dispatch] = useAppState()
  const { account } = state.connection

  // @todo: Refactor this (use singleton)
  const manager = useMemo(() => new StakeManager(account), [account])

  // -----------------------------

  const [rewards, setRewards] = useState<UseRequestRewardsFeedReturn>()

  useEffect(() => {
    const abort = new Future<void>()

    async function subscribe() {
      const lastRewardsDistribution = await manager.getLastRewardsDistribution()

      setRewards((prev) => {
        return {
          lastRewardsDistribution,
          lastRewardsCalculation: prev?.lastRewardsCalculation,
        }
      })

      const iterator = manager.subscribeRewardsFeed(abort.promise)

      for await (const data of iterator) {
        setRewards((prev) => {
          const [lastRewardsDistribution, lastRewardsCalculation] =
            data.type === 'distribution'
              ? [data, prev?.lastRewardsCalculation]
              : [prev?.lastRewardsDistribution, data]

          return {
            lastRewardsDistribution,
            lastRewardsCalculation,
          }
        })
      }
    }

    subscribe()

    return () => abort.resolve()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!rewards?.lastRewardsDistribution) return

    dispatch(
      new RequestSetAction<RewardsResponse>({
        name: 'lastRewardsDistribution',
        state: {
          data: rewards.lastRewardsDistribution,
          loading: false,
          error: undefined,
        },
      }),
    )
  }, [dispatch, rewards?.lastRewardsDistribution])

  useEffect(() => {
    if (!rewards?.lastRewardsCalculation) return

    dispatch(
      new RequestSetAction<RewardsResponse>({
        name: 'lastRewardsCalculation',
        state: {
          data: rewards.lastRewardsCalculation,
          loading: false,
          error: undefined,
        },
      }),
    )
  }, [dispatch, rewards?.lastRewardsCalculation])

  return { ...rewards }
}