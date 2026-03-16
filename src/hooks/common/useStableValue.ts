import { useRef } from 'react'

/**
 * Returns a stable reference to a value that only updates when the cache key changes.
 * This is useful for avoiding infinite loops in useEffect dependencies when dealing
 * with objects that have the same logical value but different references.
 *
 * @param value The value to stabilize
 * @param cacheKey A primitive value (string, number, etc.) that represents when the value should update
 * @returns The stabilized value
 */
export function useStableValue<T>(
  value: T,
  cacheKey: string | number | undefined,
): T {
  const valueRef = useRef<T>(value)
  const keyRef = useRef(cacheKey)

  if (keyRef.current !== cacheKey) {
    keyRef.current = cacheKey
    valueRef.current = value
  }

  return valueRef.current
}
