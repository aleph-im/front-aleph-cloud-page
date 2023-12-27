import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useRedirect(path: string): void {
  const router = useRouter()

  useEffect(() => {
    router.replace(path)
  })
}
