import { useEffect } from 'react'

export type ConfirmableEntity = { confirmed?: boolean }

export type UseRetryNotConfirmedEntitiesProp<E extends ConfirmableEntity> = {
  entities: E | E[] | undefined
  request: () => Promise<void>
  triggerOnMount: boolean
}

export function useRetryNotConfirmedEntities<E extends ConfirmableEntity>({
  entities = [],
  request,
  triggerOnMount,
}: UseRetryNotConfirmedEntitiesProp<E>) {
  useEffect(() => {
    if (!triggerOnMount) return

    const id = setTimeout(async () => {
      const notConfirmed = (
        Array.isArray(entities) ? entities : [entities]
      ).filter((entity) => !entity.confirmed)

      if (!notConfirmed.length) return

      await request()
    }, 10 * 1000)

    return () => clearTimeout(id)
  }, [entities, request, triggerOnMount])
}
