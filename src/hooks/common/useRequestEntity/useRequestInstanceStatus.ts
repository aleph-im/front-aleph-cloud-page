import { useEffect, useState } from 'react'
import { Instance, InstanceStatus } from '@/domain/instance'
import { RequestState } from '@aleph-front/core'
import { useInstanceManager } from '../useManager/useInstanceManager'

export type UseRequestInstanceStatusProps = {
  instances?: Instance[]
}

export type UseRequestInstanceStatusReturn = {
  status: Record<string, RequestState<InstanceStatus>>
  loading: boolean
}

export function useRequestInstanceStatus({
  instances,
}: UseRequestInstanceStatusProps): UseRequestInstanceStatusReturn {
  const manager = useInstanceManager()

  const [status, setStatus] = useState<
    Record<string, RequestState<InstanceStatus>>
  >({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      if (!instances) return

      await Promise.allSettled(
        instances.map(async (instance) => {
          if (status[instance.id]) return

          setStatus((prev) => ({
            ...prev,
            [instance.id]: {
              loading: true,
              data: undefined,
              error: undefined,
            },
          }))

          const instanceSpecs = await manager?.checkStatus(instance)

          setStatus((prev) => ({
            ...prev,
            [instance.id]: {
              data: instanceSpecs,
              loading: false,
              error: undefined,
            },
          }))
        }),
      )

      setLoading(false)
    }

    load()
  }, [manager, instances, status])

  // const { data: instanceSpecs } = useLocalRequest({
  //   doRequest: () => manager.getInstanceStatus(instances || []),
  //   onSuccess: () => null,
  //   flushData: false,
  //   triggerOnMount: true,
  //   triggerDeps: [instances],
  // })

  return {
    status,
    loading,
  }
}
