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
 * This hook returns a wallet-signed ECDSA publickey.
 */
export function useAuthToken() {
  const { account } = useConnect()

  // @note: Keep a reference to the private key if needed
  const [keypair, setKeypair] = useState<CryptoKeyPair | null>(null)
  const [signedJWK, setSignedJWK] = useState<SignedJWK | null>(null)

  if (!account) throw new Error('No account')

  const getToken = async () => {
    if (!crypto.subtle) {
      // @todo: polyfill this?
      throw new Error('CryptoSubtle not available')
    }
    if (
      !signedJWK ||
      signedJWK.payload.timestamp + KEYPAIR_VALIDITY < Date.now()
    ) {
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

      setKeypair(kp)
      setSignedJWK({
        payload,
        signature,
      })
    }

    return signedJWK
  }

  return { getToken }
}
