import { ethers, providers } from 'ethers5'

//@note: for future development use VoucherManager from '@/domain/voucher'
const provider = new providers.JsonRpcProvider('https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc')
const contractAddress = '0x44c9B8558067F12993Fed260C84debb89E66e93f'
const contractABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
const contract = new ethers.Contract(contractAddress, contractABI, provider)

export const NftVoucherBalance = async (address?: string): Promise<number> => {
  return (address && Number(await contract.balanceOf(address))) || 0
}
