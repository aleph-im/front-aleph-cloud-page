import { Helia, createHelia } from 'helia'
import { unixfs, UnixFS } from '@helia/unixfs'
import {
  useEffect,
  useState,
  useCallback,
  createContext,
  PropsWithChildren
} from 'react'
import { getP2PNode } from '@/helpers/ipfs'

export type HeliaContextType = {
  helia: null | Helia
  fs: null | UnixFS
  error: null | boolean
  starting: boolean
}

export const HeliaContext = createContext<HeliaContextType>({
  helia: null,
  fs: null,
  error: false,
  starting: true
})

export const HeliaProvider = ({ children }: PropsWithChildren<{}>) => {
  const [helia, setHelia] = useState<null | Helia>(null)
  const [fs, setFs] = useState<null | UnixFS>(null)
  const [starting, setStarting] = useState<boolean>(true)
  const [error, setError] = useState<null | boolean>(null)

  const startHelia = useCallback(async () => {
    if (helia) {
      console.info('helia already started')
    } else if (window.helia) {
      console.info('found a windowed instance of helia, populating ...')
      setHelia(window.helia)
      setFs(unixfs(helia))
      setStarting(false)
    } else {
      try {
        const libp2p = await getP2PNode()
        console.info('Starting Helia')
        const helia = await createHelia({ libp2p })
        setHelia(helia)
        setFs(unixfs(helia))
        setStarting(false)
      } catch (e) {
        console.error(e)
        setError(true)
      }
    }
  }, [])

  useEffect(() => {
    startHelia()
  }, [])

  return (
    <HeliaContext.Provider
      value={{
        helia,
        fs,
        error,
        starting
      }}
    >{children}</HeliaContext.Provider>
  )
}