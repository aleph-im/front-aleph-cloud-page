import { sleep } from './utils'

export const DEFAULT_PAGE_SIZE = 100
export const DEFAULT_DELAY_MS = 100

export type PaginatedFetcher<T> = (
  page: number,
  pageSize: number,
) => Promise<{
  items: T[]
  hasMore: boolean
}>

export type FetchAllPagesOptions = {
  pageSize?: number
  delayMs?: number
}

export async function fetchAllPages<T>(
  fetcher: PaginatedFetcher<T>,
  options: FetchAllPagesOptions = {},
): Promise<T[]> {
  const { pageSize = DEFAULT_PAGE_SIZE, delayMs = DEFAULT_DELAY_MS } = options

  const allItems: T[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const result = await fetcher(page, pageSize)
    allItems.push(...result.items)

    // Check if we got fewer results than requested, indicating last page
    if (result.items.length < pageSize) {
      hasMore = false
    } else {
      hasMore = result.hasMore
      page++
      // Add a small delay between requests to avoid rate limiting
      if (hasMore && delayMs > 0) {
        await sleep(delayMs)
      }
    }
  }

  return allItems
}
