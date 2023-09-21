import { useAddIPFSFileOrCid } from '@/hooks/form/useAddIPFSFileOrCid'
import { AddFileOrCidProps } from './types'
import { Tabs } from '@aleph-front/aleph-core'

export default function AddIPFSFileOrCid(props: AddFileOrCidProps) {
  const { typeCtrl } = useAddIPFSFileOrCid(props)

  return (
    <>
      <div tw="px-0 pt-6 pb-3">
        <Tabs
          selected={typeCtrl.field.value}
          align="left"
          tabs={[
            {
              id: 'file',
              name: 'File/Folder',
            },
            {
              id: 'cid',
              name: 'CID',
            },
          ]}
          onTabChange={typeCtrl.field.onChange}
        />
      </div>
      <div role="tabpanel"></div>
    </>
  )
}
