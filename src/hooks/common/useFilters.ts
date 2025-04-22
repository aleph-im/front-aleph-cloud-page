import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppState } from '@/contexts/appState'
import {
  FilterAddAction,
  FilterDelAction,
  FilterItem,
  FilterSetAction,
} from '@/store/filter'

export type UseFiltersProps = {
  syncUrl?: boolean
}

export type UseFiltersReturn = {
  filters: Record<string, FilterItem | null>
  handleAddFilter: (key: string, value: string) => void
  handleDelFilter: (key: string) => void
}

export function useFilters({
  syncUrl = false,
}: UseFiltersProps): UseFiltersReturn {
  const [state, dispatch] = useAppState()
  const filters = state.filter

  const router = useRouter()

  // -----------------------------

  useEffect(() => {
    if (!syncUrl) return
    if (!router.isReady) return

    const urlArgs = router.asPath.split('?')[1]
    const urlParams = Object.fromEntries(new URLSearchParams(urlArgs).entries())
    const stateParams = Object.fromEntries(
      Object.entries(filters).map(([key, val]) => [key, val ? val.value : val]),
    )

    const newFilters: Record<string, string | null> = {
      ...urlParams,
      ...stateParams,
    }

    const addToState = Object.keys(newFilters).filter((key) => {
      const fValue = stateParams[key] || null
      return fValue !== newFilters[key]
    })

    const addToUrl = Object.keys(newFilters).filter((key) => {
      const qValue = urlParams[key] || null
      return qValue !== newFilters[key]
    })

    if (addToState.length) {
      const state = addToState.reduce(
        (ac, key) => {
          const value = newFilters[key]
          ac[key] = value ? { key, value } : null
          return ac
        },
        { ...filters },
      )

      dispatch(new FilterSetAction({ state }))
    }

    if (addToUrl.length) {
      const query = addToUrl.reduce(
        (ac, key) => {
          const value = newFilters[key]

          if (value) {
            ac[key] = value
          } else {
            delete ac[key]
          }

          return ac
        },
        { ...router.query },
      )

      router.replace({ query })
    }
  }, [syncUrl, filters, router, dispatch])

  const handleAddFilter = useCallback(
    (key: string, value: string) =>
      dispatch(new FilterAddAction({ key, value })),
    [dispatch],
  )

  const handleDelFilter = useCallback(
    (key: string) => dispatch(new FilterDelAction({ key })),
    [dispatch],
  )

  return {
    filters,
    handleAddFilter,
    handleDelFilter,
  }
}
