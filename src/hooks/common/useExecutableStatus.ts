import { useEffect, useState } from 'react'
import { Executable, ExecutableStatus } from '@/domain/executable'
import { ExecutableManager } from '@/domain/executable'

export type UseExecutableStatusProps = {
  executable: Executable | undefined
  manager?: ExecutableManager<any>
}

export type UseExecutableStatusReturn = ExecutableStatus | undefined

export function useExecutableStatus({
  executable,
  manager,
}: UseExecutableStatusProps): UseExecutableStatusReturn {
  const [status, setStatus] = useState<UseExecutableStatusReturn>(undefined)

  useEffect(() => {
    if (!manager) return
    if (!executable) return
    if (status) return

    async function request() {
      if (!manager) return
      if (!executable) return

      const status = await manager.checkStatus(executable)
      setStatus(status)
    }

    if (!status) request()

    const id = setInterval(request, 10 * 1000)
    return () => clearInterval(id)
  }, [status, executable, manager])

  return status
}
