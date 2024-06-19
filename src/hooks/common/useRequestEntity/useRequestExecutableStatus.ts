import { useEffect, useState } from 'react'
import { Executable, ExecutableStatus } from '@/domain/executable'
import { RequestState } from '@aleph-front/core'
import { useInstanceManager } from '../useManager/useInstanceManager'

export type UseRequestExecutableStatusProps = {
  entities?: Executable[]
}

export type UseRequestExecutableStatusReturn = {
  status: Record<string, RequestState<ExecutableStatus>>
  loading: boolean
}

export function useRequestExecutableStatus({
  entities,
}: UseRequestExecutableStatusProps): UseRequestExecutableStatusReturn {
  const manager = useInstanceManager()

  const [status, setStatus] = useState<
    Record<string, RequestState<ExecutableStatus>>
  >({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      if (!entities) return

      await Promise.allSettled(
        entities.map(async (executable) => {
          if (status[executable.id]) return

          setStatus((prev) => ({
            ...prev,
            [executable.id]: {
              loading: true,
              data: undefined,
              error: undefined,
            },
          }))

          const data = await manager?.checkStatus(executable)

          setStatus((prev) => ({
            ...prev,
            [executable.id]: {
              data,
              loading: false,
              error: undefined,
            },
          }))
        }),
      )

      setLoading(false)
    }

    load()
  }, [manager, entities, status])

  // const { data: instanceSpecs } = useLocalRequest({
  //   doRequest: () => manager.getExecutableStatus(entities || []),
  //   onSuccess: () => null,
  //   flushData: false,
  //   triggerOnMount: true,
  //   triggerDeps: [entities],
  // })

  return {
    status,
    loading,
  }
}
