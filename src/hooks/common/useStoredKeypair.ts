import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export const KEYPAIR_VALIDITY = 1000 * 60 * 60 * 2

export type StoredKeypairType = {}

export type ExpiringItem<T> = {
  value: T
  expires: number
}

export const getExpiringItem = <T>(
  value: T,
  expiration = KEYPAIR_VALIDITY,
): ExpiringItem<T> => ({
  value,
  expires: Date.now() + expiration,
})

const getKeyPair = async () => {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify'],
  )
  return keyPair
}

/**
 * This hook returns a wallet-signed ECDSA keypair.
 * It is stored in localStorage to avoid multiple signature requests and has a validity of 2 hours.
 */
export function useStoredKeypair() {
  // returns true if cryptoSubtle is not available in the browser
  const [cryptoErr, setCryptoErr] = useState<boolean | null>(null)

  // returns true if the keypair is newly generated, false if retrieved from localStorage
  const [isFresh, setIsFresh] = useState<boolean | null>(null)

  const [keypair, setKeypair] =
    useLocalStorage<ExpiringItem<StoredKeypairType> | null>('keypair', null)

  useEffect(() => {
    if (!crypto.subtle) {
      // @todo: polyfill this?
      setCryptoErr(true)
      return
    }
    if (!keypair || keypair.expires > Date.now()) {
      const initKP = async () => {
        try {
          const kp = await getKeyPair()
          const publicKey = await crypto.subtle.exportKey('jwk', kp.publicKey)
          const privateKey = await crypto.subtle.exportKey('jwk', kp.privateKey)
          setIsFresh(true)
          setCryptoErr(false)
          setKeypair(getExpiringItem({ publicKey, privateKey }))
        } catch (err) {
          console.error(err)
          setCryptoErr(true)
        }
      }
      initKP()
    } else {
      setIsFresh(false)
    }
  }, [])

  return { cryptoErr, keypair, isFresh }
}
