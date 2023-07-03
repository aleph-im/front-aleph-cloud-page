import { ProgramMessage, StoreMessage } from 'aleph-sdk-ts/dist/messages/types'
import useConnectedWard from '../useConnectedWard'
import { AccountFileObject } from '@/helpers/aleph'
import { useGetFileSize } from '../useGetFileSize'
import { SSHKey } from '@/helpers/ssh'
import { useAccountProducts } from '../useAccountProducts'
import { Instance } from '@/helpers/instance'
import { useMemo } from 'react'

export type AnyProduct = ProgramMessage | Instance | StoreMessage | SSHKey

export type DashboardHomePage = {
  functions: ProgramMessage[]
  instances: Instance[]
  volumes: StoreMessage[]
  sshKeys: SSHKey[]
  all: AnyProduct[]
  fileStats: AccountFileObject[]
}

export function useDashboardHomePage(): DashboardHomePage {
  useConnectedWard()
  const products = useAccountProducts()
  const [fileStatsWrapper] = useGetFileSize()

  const all = useMemo(
    () => Object.values(products).flatMap((product) => product as AnyProduct[]),
    [products],
  )

  return {
    ...products,
    all,
    fileStats: fileStatsWrapper.files,
  }
}
