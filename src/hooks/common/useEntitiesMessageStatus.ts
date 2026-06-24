import { useEffect, useMemo, useRef, useState } from 'react'
import {
  EntityMessageStatus,
  getMessageStatus,
  shouldPollMessageStatus,
} from '@/helpers/messageStatus'

const POLL_INTERVAL_MS = 10 * 1000

export type EntityMessageStatusMap = Record<string, EntityMessageStatus>

/**
 * Resolves the aleph message status for a set of entities (keyed by `id` =
 * message item hash) and keeps non-terminal ones up to date.
 *
 * Replaces the on-chain `confirmed` polling: it fetches each entity's
 * processing status from the `/messages/{hash}/status` endpoint and re-polls
 * only the entities whose status can still change (pending/removing).
 */
export function useEntitiesMessageStatus<E extends { id: string }>(
  entities: E[] = [],
): EntityMessageStatusMap {
  const [statuses, setStatuses] = useState<EntityMessageStatusMap>({})

  // Latest statuses, readable inside the interval without re-subscribing.
  const statusesRef = useRef(statuses)
  statusesRef.current = statuses

  const ids = useMemo(() => entities.map((e) => e.id), [entities])
  const idsKey = ids.join(',')

  useEffect(() => {
    if (!ids.length) return
    let cancelled = false

    const fetchStatuses = async (targetIds: string[]) => {
      if (!targetIds.length) return
      const entries = await Promise.all(
        targetIds.map(async (id) => [id, await getMessageStatus(id)] as const),
      )
      if (cancelled) return

      setStatuses((prev) => {
        const next = { ...prev }
        for (const [id, status] of entries) {
          if (status) next[id] = status
        }
        return next
      })
    }

    // Initial pass: learn the current status of every entity.
    fetchStatuses(ids)

    const interval = setInterval(() => {
      const pollable = ids.filter((id) =>
        shouldPollMessageStatus(statusesRef.current[id]),
      )
      if (!pollable.length) return
      fetchStatuses(pollable)
    }, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
    // idsKey captures the entity set; statuses are read via the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  return statuses
}
