import { useEffect, useState } from 'react'
import { NodeLastVersions } from '@/domain/node'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'

export type UseRequestCRNLastVersionReturn = {
  lastVersion?: NodeLastVersions
  loading: boolean
}

export function useRequestCRNLastVersion(): UseRequestCRNLastVersionReturn {
  const nodeManager = useNodeManager()

  const [lastVersion, setLastVersion] = useState<NodeLastVersions>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      const version = await nodeManager.getLatestCRNVersion()

      setLastVersion(version)

      setLoading(false)
    }

    load()
  }, [nodeManager])

  return {
    lastVersion,
    loading,
  }
}
