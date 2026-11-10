import { JsonRpcProvider } from 'ethers'

const provider = new JsonRpcProvider('https://eth.drpc.org')

export const EnsNameLookup = async (
  address?: string,
): Promise<string | undefined> => {
  return (address && (await provider.lookupAddress(address))) || undefined
}

export const EnsAddressLookup = async (
  ens?: string,
): Promise<string | undefined> => {
  return (ens && (await provider.resolveName(ens))) || undefined
}
