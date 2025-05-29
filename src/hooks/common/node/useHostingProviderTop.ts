import { AlephNode } from '@/domain/node'
import { useMemo } from 'react'

export type UseHostingProviderTopProps<T extends AlephNode> = {
  nodes?: T[]
}

export type UseHostingProviderTopItem = {
  tier: number
  name: string
  count: number
  percentage: number
  color: string
}

export type UseHostingProviderTopReturn = {
  total: number
  buckets: Record<string, number>
  top: UseHostingProviderTopItem[]
}

export function useHostingProviderTop<T extends AlephNode>({
  nodes,
}: UseHostingProviderTopProps<T>): UseHostingProviderTopReturn {
  const buckets = useMemo(() => {
    const safeNodes =
      nodes ||
      Array.from(
        { length: 4 },
        (_, i) => ({ metricsData: { as_name: `Provider ${i}` } }) as T,
      )

    return safeNodes.reduce(
      (ac, node) => {
        const asnName = node.metricsData?.as_name || 'others'
        ac[asnName] = (ac[asnName] || 0) + 1
        return ac
      },
      { others: 0 } as Record<string, number>,
    )
  }, [nodes])

  const total = useMemo(
    () => Object.values(buckets).reduce((ac, cv) => ac + cv, 0),
    [buckets],
  )

  const top = useMemo(() => {
    const sortedBuckets = Object.entries(buckets)
      .filter(([name]) => name !== 'others')
      .sort(([, a], [, b]) => b - a)

    const top3Buckets = sortedBuckets.slice(0, 3)
    const restBuckets = sortedBuckets.slice(3)

    const othersBucket: [string, number] = [
      'others',
      buckets['others'] + restBuckets.reduce((ac, [, cv]) => ac + cv, 0),
    ]

    return [...top3Buckets, othersBucket].map(([name, count], i) => {
      const percentage = count / total
      const color =
        i === 0 ? 'success' : i === 1 ? 'warning' : i === 2 ? 'error' : 'main0'

      return {
        tier: i + 1,
        name,
        count,
        percentage,
        color,
      }
    })
  }, [buckets, total])

  return { total, buckets, top }
}
