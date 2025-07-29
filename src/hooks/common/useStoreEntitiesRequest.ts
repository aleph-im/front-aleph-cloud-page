import { Dispatch, useMemo } from 'react'
import { useAppState } from '@/contexts/appState'
import {
  EntityAction,
  EntityAddAction,
  EntitySetAction,
  EntityState,
} from '@/store/entity'
import { StoreState } from '@/store/store'
import {
  UseRequestProps,
  UseRequestReturn,
  useRequest,
} from '@aleph-front/core'

export type StoreEntityRequest<T> = {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

export type UseStoreEntityRequestProps<T, S> = Omit<
  UseRequestProps<T[]>,
  'state' | 'setState'
> & {
  state: S
  dispatch: Dispatch<EntityAction<T>>
  name: string & keyof S
  cacheStrategy: CACHE_STRATEGY
}

export type UseStoreEntityRequestReturn<T> = UseRequestReturn<T[]>

export type CACHE_STRATEGY = 'none' | 'overwrite' | 'merge'

function useStoreEntityRequest<T, S>({
  state: store,
  dispatch,
  name,
  cacheStrategy = 'overwrite',
  ...props
}: UseStoreEntityRequestProps<T, S>): UseStoreEntityRequestReturn<T> {
  const slice = store[name] as EntityState<T>

  const state = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { entities: data, keys, ...rest } = slice

    return { data, ...rest }
  }, [slice])

  return useRequest({
    state,
    setState: (newState) => {
      switch (cacheStrategy) {
        case 'none':
          break
        case 'overwrite':
          dispatch(new EntitySetAction({ name, state: newState }))
          break
        case 'merge':
          dispatch(new EntityAddAction({ name, entities: newState.data || [] }))
          break
      }
    },
    ...props,
  })
}

export type UseAppStoreEntityRequestProps<T> = Omit<
  UseStoreEntityRequestProps<T, StoreState>,
  'state' | 'dispatch'
>

export function useAppStoreEntityRequest<T>(
  props: UseAppStoreEntityRequestProps<T>,
): UseStoreEntityRequestReturn<T> {
  const [state, dispatch] = useAppState()

  return useStoreEntityRequest<T, StoreState>({ state, dispatch, ...props })
}
