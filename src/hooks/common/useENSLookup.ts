import { useEffect, useState } from 'react'
import { EnsNameLookup, EnsAddressLookup } from '@/domain/ens'

export const useEnsNameLookup = (address?: string) => {
  const [ensName, setEnsName] = useState('')
  useEffect(() => {
    EnsNameLookup(address).then((name) => name && setEnsName(name))
  }, [address])
  return ensName
}

export const useEnsAddressLookup = (ens?: string) => {
  const [ensAddress, setEnsAddress] = useState('')
  useEffect(() => {
    EnsAddressLookup(ens).then((address) => address && setEnsAddress(address))
  }, [ens])
  return ensAddress
}
