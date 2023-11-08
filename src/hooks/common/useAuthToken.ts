import { getSignableBuffer, getECDSAKeyPair } from '@/helpers/utils'
import { useCallback, useState } from 'react'
import { useConnect } from './useConnect'
import {
  SignedOperationHeaderType,
  SignedPubkeyHeaderType,
} from '@/helpers/constants'

export const KEYPAIR_VALIDITY = 1000 * 60 * 60 * 2

/**
 * This hook exposes a function which creates and stores a wallet-signed Json Web Publickey
 */
export function useAuthToken() {
  const { account } = useConnect()

  const [keypair, setKeypair] = useState<CryptoKeyPair | null>(null)
  const [signedJWK, setSignedJWK] = useState<SignedPubkeyHeaderType | null>(
    null,
  )

  if (!account) throw new Error('No account')

  /**
   * Returns a public key signed by the user's wallet that will be trusted by the API
   */
  const getSignedPubkeyToken =
    useCallback(async (): Promise<SignedPubkeyHeaderType> => {
      if (!crypto.subtle) {
        // @todo: polyfill this?
        throw new Error('CryptoSubtle not available')
      }
      if (!signedJWK || signedJWK.payload.expires.getTime() < Date.now()) {
        const kp = await getECDSAKeyPair()
        const pubKey = await crypto.subtle.exportKey('jwk', kp.publicKey)
        const payload = {
          pubkey: pubKey,
          expires: new Date(new Date().getTime() + KEYPAIR_VALIDITY),
          domain: 'console.aleph.im',
          address: account.address,
        }

        const buf = getSignableBuffer(payload)
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [buf, account.address],
        })
        const token: SignedPubkeyHeaderType = {
          payload,
          signature,
        }

        setKeypair(kp)
        setSignedJWK(token)
        return token
      }

      return signedJWK
    }, [account, signedJWK])

  /**
   * Uses the key generated by getSignedPubkeyToken to sign an operation token
   */
  const getSignedOperationToken = useCallback(
    async (
      path: string,
      method: 'POST' | 'GET',
    ): Promise<SignedOperationHeaderType> => {
      if (!keypair) {
        await getSignedPubkeyToken()
      }
      const payload = {
        time: new Date(),
        path,
        method,
      }

      const signature = await crypto.subtle.sign(
        'ECDSA',
        // @ts-ignore
        keypair.privateKey,
        Buffer.from(JSON.stringify(payload)),
      )

      return {
        payload,
        signature: Buffer.from(signature).toString('hex'),
      }
    },
    [],
  )

  return { getSignedPubkeyToken, getSignedOperationToken }
}
