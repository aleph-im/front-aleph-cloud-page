import { useEffect, useState } from 'react'
import { CRNSpecs } from '@/domain/node'
import { useNodeManager } from '@/hooks/common/useManager/useNodeManager'

export type UseRequestCRNSpecsReturn = {
  specs: Record<string, CRNSpecs>
  loading: boolean
}

const gpus = [
  {
    vendor: 'NVIDIA',
    model: 'RTX 4000 ADA',
    device_name: 'AD104GL [RTX 4000 SFF Ada Generation]',
    device_class: '0300',
    pci_host: '01:00.0',
    device_id: '10de:27b0',
    compatible: true,
  },
  {
    vendor: 'NVIDIA',
    model: 'H100',
    device_name: 'AD104GL [RTX 4000 SFF Ada Generation]',
    device_class: '0300',
    pci_host: '01:00.0',
    device_id: '10de:27b1',
    compatible: true,
  },
]

export function useRequestCRNSpecs(): UseRequestCRNSpecsReturn {
  const nodeManager = useNodeManager()

  const [specs, setSpecs] = useState<Record<string, CRNSpecs>>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      const crnSpecs = await nodeManager.getAllCRNsSpecs()

      crnSpecs.forEach((spec) => {
        if (
          [
            'ab5366bb2d2d9b4e51e6caf4f633a69b200316edd3a6137b245a62ed631dec79',
            'fa5e90818bf50f358b642ed31361d83a0c6e94a1e07b055764d7e82789437f82',
          ].includes(spec.hash)
        ) {
          setSpecs((prev) => ({
            ...prev,
            [spec.hash]: {
              ...spec,
              gpu_support: true,
              compatible_available_gpus: gpus,
            },
          }))
        } else {
          setSpecs((prev) => ({
            ...prev,
            [spec.hash]: spec,
          }))
        }
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
