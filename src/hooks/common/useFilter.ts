import { useMemo } from 'react'
import { useAppState } from '@/contexts/appState'
import { FilterAddAction, FilterDelAction } from '@/store/filter'

export type UseFilterProps = {
  key: string
  debounced?: number
}

export type UseFilterReturn = [string | undefined, (value: string) => void]

// @todo: move it to core package utils
export function debounce(
  cb: (...args: any[]) => void,
  delay: number,
): (...args: any) => void {
  let id: NodeJS.Timeout

  return (args) => {
    clearTimeout(id)
    id = setTimeout(() => cb(args), delay)
  }
}

export function useFilter({
  key,
  debounced = 0,
}: UseFilterProps): UseFilterReturn {
  const [state, dispatch] = useAppState()
  const filters = state.filter || {}

  const filter = filters[key]?.value

  const handleChange = useMemo(() => {
    return debounce((value) => {
      return value
        ? dispatch(new FilterAddAction({ key, value }))
        : dispatch(new FilterDelAction({ key }))
    }, debounced)
  }, [debounced, key, dispatch])

  return [filter, handleChange]
}