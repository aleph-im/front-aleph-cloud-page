import { useRouter } from 'next/router'

export function useBasePath() {
  const { basePath } = useRouter()
  return basePath
}
