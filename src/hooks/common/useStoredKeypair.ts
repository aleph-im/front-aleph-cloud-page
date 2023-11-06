import { getSignableBuffer } from '@/helpers/utils'
import { useEffect, useState } from 'react'
import { useConnect } from './useConnect'

export const KEYPAIR_VALIDITY = 1000 * 60 * 60 * 2

export type SignedJWK = {
  payload: {
    pubkey: JsonWebKey
    timestamp: number
  }
  signature: string
}

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
  const { account } = useConnect()

  // returns true if cryptoSubtle is not available in the browser
  const [cryptoErr, setCryptoErr] = useState<boolean | null>(null)
  const [keypair, setKeypair] = useState<CryptoKeyPair | null>(null)
  const [signedJWK, setSignedJWK] = useState<SignedJWK | null>(null)

  if (!account) throw new Error('No account')

  useEffect(() => {
    if (!crypto.subtle) {
      // @todo: polyfill this?
      setCryptoErr(true)
      return
    }
    if (
      !signedJWK ||
      signedJWK.payload.timestamp + KEYPAIR_VALIDITY < Date.now()
    ) {
      const initKP = async () => {
        try {
          const kp = await getKeyPair()
          const pubKey = await crypto.subtle.exportKey('jwk', kp.publicKey)
          const payload = {
            pubkey: pubKey,
            timestamp: Date.now(),
          }

          const buf = getSignableBuffer(payload)
          const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [buf, account.address],
          })

          setCryptoErr(false)
          setKeypair(kp)
          setSignedJWK({
            payload,
            signature,
          })
        } catch (err) {
          console.error(err)
          setCryptoErr(true)
        }
      }
      initKP()
    }
  }, [])

  return { cryptoErr, keypair }
}
