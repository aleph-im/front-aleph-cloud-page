import { useCallback } from 'react'
import { useAppState } from '@/contexts/appState'
import {
  EntityDelAction,
  createCascadeInvalidationActions,
} from '@/store/entity'

export type UseDeleteEntityActionProps = {
  entityName: string
}

export type UseDeleteEntityActionReturn = {
  dispatchDeleteEntity: (entityId: string | string[]) => void
}

/**
 * Hook that provides a consistent way to delete entities with cascade invalidation
 * Handles both EntityDelAction dispatch and related cache invalidation
 */
export function useDispatchDeleteEntityAction({
  entityName,
}: UseDeleteEntityActionProps): UseDeleteEntityActionReturn {
  const [, dispatch] = useAppState()

  const dispatchDeleteEntity = useCallback(
    (entityId: string | string[]) => {
      // Delete the specific entity
      dispatch(
        new EntityDelAction({
          name: entityName,
          keys: entityId,
        }),
      )

      // Clear all related entity caches for complete consistency
      const cascadeActions = createCascadeInvalidationActions(entityName as any)
      cascadeActions.forEach((action) => dispatch(action))
    },
    [dispatch, entityName],
  )

  return {
    dispatchDeleteEntity,
  }
}
