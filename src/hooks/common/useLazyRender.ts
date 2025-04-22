import { useState, useEffect } from 'react'

export type UseLazyRenderReturn = { render: boolean }

export function useLazyRender(): UseLazyRenderReturn {
  const [render, setRender] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => setRender(true))
    return () => clearTimeout(timeoutId)
  }, [])

  return { render }
}
