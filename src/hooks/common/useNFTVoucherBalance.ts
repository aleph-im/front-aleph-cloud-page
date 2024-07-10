import { useConnection } from '@/hooks/common/useConnection'
import { useEffect, useState } from 'react'
import { NftVoucherBalance } from '@/domain/vouchers'

/* Quick integration for ETHCC
  To change:
  - Use available injected provider, instead of a new Ethers one?
  - Fetch NFT metadata to do proper checks on what users can create or not */

export const useNFTVoucherBalance = () => {
  const { account } = useConnection({
    triggerOnMount: false,
  })
  const [nftVoucherBalance, setNftVoucherBalance] = useState(0)

  useEffect(() => {
    NftVoucherBalance(account?.address)
      .then((balance: number) => {
        setNftVoucherBalance(balance)
      })
      .catch((err: string) => console.log(err))
  }, [account?.address])

  return nftVoucherBalance
}
