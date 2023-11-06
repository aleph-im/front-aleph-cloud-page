import { HeliaContext } from '@/contexts/helia'
import { useContext } from 'react'

export function useHelia() {
  const { helia, fs, error, starting } = useContext(HeliaContext)
  return { helia, fs, error, starting }
}
