import { useEffect, useState } from 'react'
import { CRNSpecs } from '@/domain/node'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'

export type UseRequestCRNSpecsReturn = {
  specs: Record<string, CRNSpecs>
  loading: boolean
}

export function useRequestCRNSpecs(): UseRequestCRNSpecsReturn {
  const nodeManager = useNodeManager()

  const [specs, setSpecs] = useState<Record<string, CRNSpecs>>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      const crnSpecs = await nodeManager.getAllCRNsSpecs()

      crnSpecs.forEach((spec) => {
        setSpecs((prev) => ({
          ...prev,
          [spec.hash]: spec,
        }))
      })

      setLoading(false)
    }

    load()
  }, [nodeManager])

  return {
    specs,
    loading,
  }
}
