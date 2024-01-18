import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useRedirect(path: string, condition = true): void {
  const router = useRouter()

  useEffect(() => {
    if (!condition) return
    router.replace(path)
  }, [condition, path, router])
}
