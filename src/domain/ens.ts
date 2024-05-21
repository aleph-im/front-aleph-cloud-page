import { useEffect, useState } from 'react'
import { providers } from 'ethers'

const provider = new providers.JsonRpcProvider('https://eth.drpc.org')

export const ENSLookup = (address?: string) => {
  const [ensName, setEnsName] = useState('')
  useEffect(() => {
    address &&
      provider.lookupAddress(address).then((name) => name && setEnsName(name))
  }, [address])
  return ensName
}
