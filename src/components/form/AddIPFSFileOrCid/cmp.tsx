import { useAddIPFSFileOrCid } from '@/hooks/form/useAddIPFSFileOrCid'
import { AddFileOrCidProps } from './types'
import { Icon, Tabs, TextInput } from '@aleph-front/aleph-core'
import NoisyContainer from '@/components/common/NoisyContainer'
import HiddenFileInput from '@/components/common/HiddenFileInput'
import { useNewIPFSPinningPage } from '@/hooks/pages/dashboard/useNewIPFSPinningPage'

export default function AddIPFSFileOrCid(props: AddFileOrCidProps) {
  const { typeCtrl } = useAddIPFSFileOrCid(props)
  const { handleFileChange } = useNewIPFSPinningPage()

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
        <div role="tabpanel" tw="my-6">
          { typeCtrl.field.value === 'file' ?
          <NoisyContainer>
            <div tw="flex my-6">
              <div tw="mr-6">
                <HiddenFileInput onChange={(f: File) => handleFileChange(f)}>
                  <Icon name="file" tw="mr-3" />
                  Upload file 
                </HiddenFileInput>
              </div>

              <div>
                <HiddenFileInput directory webkitDirectory onChange={(f: FileList) => handleFileChange(f)}>
                  <Icon name="folder" tw="mr-3" />
                  Upload directory
                </HiddenFileInput>
              </div>
            </div>

            <div>
              <TextInput name="fileName" label='Name' placeholder='name' />
            </div>
          </NoisyContainer>
          : 
          <NoisyContainer>
            <div tw="my-6">
                <TextInput name="cid" label='CID' placeholder='CID' />
            </div>
          </NoisyContainer>
          }
        </div>
        
    </>
  )
}
