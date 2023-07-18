import { useEffect, useState } from 'react'
import { useInstanceManager } from './useManager/useInstanceManager'
import { Instance, InstanceStatus } from '@/domain/instance'

export type UseInstanceStatusProps = Instance | undefined

export type UseInstanceStatusReturn = InstanceStatus | undefined

export function useInstanceStatus(
  instance: UseInstanceStatusProps,
): UseInstanceStatusReturn {
  const [status, setStatus] = useState<InstanceStatus | undefined>(undefined)

  const manager = useInstanceManager()

  useEffect(() => {
    if (!manager) return
    if (!instance) return
    if (status) return

    async function request() {
      if (!manager) return
      if (!instance) return

      const status = await manager.checkStatus(instance)
      setStatus(status)
    }

    if (!status) request()

    const id = setInterval(request, 10 * 1000)
    return () => clearInterval(id)
  }, [status, instance, manager])

  return status
}
