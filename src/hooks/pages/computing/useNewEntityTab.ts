import { useRouter } from 'next/router'
import { useCallback } from 'react'

export type NewEntityTabId = 'instance' | 'function' | 'confidential'

export type UseNewEntityTabProps = {
  selected: NewEntityTabId
}

export type UseNewEntityTab = UseNewEntityTabProps & {
  handleChange: (id: string) => void
}

export function useNewEntityTab(props: UseNewEntityTabProps): UseNewEntityTab {
  const router = useRouter()

  const handleChange = useCallback(
    (id: string) => {
      router.push(`/computing/${id}/new`)
    },
    [router],
  )

  return {
    ...props,
    handleChange,
  }
}
