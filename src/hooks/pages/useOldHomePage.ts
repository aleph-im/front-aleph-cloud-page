import { useRouter } from 'next/router'
import { useResponsiveMin } from '@aleph-front/core'
import { RefObject, useCallback } from 'react'
import { useScrollTo } from '../common/useScrollTo'
import { useConnect } from '../common/useConnect'

export type SolutionsHomePage = {
  featureSectionBg: string
  navigate: {
    function: () => void
    instance: () => void
    volume: () => void
    indexer: () => void
  }
  scroll: {
    function: { ref: RefObject<HTMLElement>; handle: () => void }
    volume: { ref: RefObject<HTMLElement>; handle: () => void }
  }
}

export function useOldHomePage(): SolutionsHomePage {
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

    router.push('/computing/function')
  }, [connect, isConnected, router])

  // @note: wait till account is connected and redirect
  const navigateInstance = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
    }

    router.push('/computing/instance/new')
  }, [connect, isConnected, router])

  // @note: wait till account is connected and redirect
  const navigateVolume = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
    }

    router.push('/storage/volume')
  }, [connect, isConnected, router])

  // @note: wait till account is connected and redirect
  const navigateIndexer = useCallback(async () => {
    if (!isConnected) {
      const acc = await connect()
      if (!acc) return
    }

    router.push('/dashboard/indexer')
  }, [connect, isConnected, router])

  return {
    featureSectionBg,
    navigate: {
      function: navigateFunction,
      instance: navigateInstance,
      volume: navigateVolume,
      indexer: navigateIndexer,
    },
    scroll: {
      function: { ref: scroll1[0], handle: scroll1[1] },
      volume: { ref: scroll2[0], handle: scroll2[1] },
    },
  }
}
