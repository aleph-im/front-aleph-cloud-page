import { useCallback, useMemo, useState } from 'react'

export type UseSortedListProps<T> = {
  list?: T[]
}

export type UseSortedListReturn<T> = {
  list?: T[]
  handleSortItems: (sortFn: SortFn<T>) => void
}

export type SortFn<T> = (list: T[] | undefined) => T[] | undefined

export function useSortedList<T>({
  list,
}: UseSortedListProps<T>): UseSortedListReturn<T> {
  const [sortFn, setSortFn] = useState<SortFn<T>>()

  const output = useMemo(() => {
    if (!list) return list
    if (!sortFn) return list
    return sortFn(list)
  }, [list, sortFn])

  const handleSortItems = useCallback(
    (sortFn: SortFn<T>) => setSortFn(() => sortFn),
    [],
  )

  return {
    list: output,
    handleSortItems,
  }
}
