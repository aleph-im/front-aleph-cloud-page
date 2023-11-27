import {
  SignedOperationHeaderName,
  SignedPubkeyHeaderName,
} from '@/helpers/constants'
import { useAuthToken } from './useAuthToken'
import { toWebHeaderToken } from '@/helpers/utils'

export function useTrustedOperation() {
  const { getSignedOperationToken, getSignedPubkeyToken } = useAuthToken()

  const stopMachine = async (hostname: string, vmHash: string) => {
    const path = `https://[${hostname}]/control/machine/${vmHash}/stop}`
    const pubKeyToken = await getSignedPubkeyToken()
    const operationToken = await getSignedOperationToken(path, 'POST')

    const headers = new Headers()
    headers.append(SignedPubkeyHeaderName, toWebHeaderToken(pubKeyToken))
    headers.append(SignedOperationHeaderName, toWebHeaderToken(operationToken))
    headers.append('Content-Type', 'application/json')

    // @todo: Use the proper request method
    fetch(path, {
      method: 'POST',
      headers,
    })
  }

  return {
    stopMachine,
  }
}
