import { useRouter } from 'next/router'
import { useScrollTo } from '../useScrollTo'
import { useResponsiveMin } from '@aleph-front/aleph-core'
import { RefObject, useCallback } from 'react'
import { useConnect } from '../useConnect'

export type HomePage = {
  featureSectionBg: string
  navigate: {
    function: () => void
    volume: () => void
  }
  scroll: {
    function: { ref: RefObject<HTMLElement>; handle: () => void }
    volume: { ref: RefObject<HTMLElement>; handle: () => void }
  }
}

export function useHomePage(): HomePage {
  const scroll1 = useScrollTo()
  const scroll2 = useScrollTo()

  const { connect, isConnected } = useConnect()
  const router = useRouter()

  const isDesktop = useResponsiveMin('md')
  const featureSectionBg = isDesktop ? '' : 'fx-glass-base0'

  // @note: wait till account is connected and redirect
  const navigateFunction = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
    }

    router.push('/solutions/dashboard/function')
  }, [connect, isConnected, router])

  // @note: wait till account is connected and redirect
  const navigateVolume = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
    }

    router.push('/solutions/dashboard/volume')
  }, [connect, isConnected, router])

  return {
    featureSectionBg,
    navigate: {
      function: navigateFunction,
      volume: navigateVolume,
    },
    scroll: {
      function: { ref: scroll1[0], handle: scroll1[1] },
      volume: { ref: scroll2[0], handle: scroll2[1] },
    },
  }
}
