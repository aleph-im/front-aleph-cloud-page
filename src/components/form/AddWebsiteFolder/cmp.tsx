import { Icon, Button, NoisyContainer, TextInput } from '@aleph-front/core'
import { RemoveWebsiteFolderProps, AddWebsiteFolderProps } from './types'
import React, { memo } from 'react'
import { useAddWebsiteFolderProps } from '@/hooks/form/useAddWebsiteFolder'
import HiddenFileInput from '@/components/common/HiddenFileInput'
import IconText from '@/components/common/IconText'
import { useCopyToClipboardAndNotify } from '@/hooks/common/useCopyToClipboard'

const RemoveWebsite = memo(
  ({ onRemove: handleRemove }: RemoveWebsiteFolderProps) => {
    return (
      <div tw="mt-4 pt-6 text-right">
        <Button
          type="button"
          kind="functional"
          variant="warning"
          size="md"
          onClick={handleRemove}
        >
          Remove
        </Button>
      </div>
    )
  },
)
RemoveWebsite.displayName = 'RemoveWebsite'

// -------------------------------------------------

export const AddWebsiteFolder = memo((props: AddWebsiteFolderProps) => {
  const { folderCtrl, cidCtrl, folderSize } = useAddWebsiteFolderProps(props)

  const [, copyAndNotify] = useCopyToClipboardAndNotify()

  return (
    <NoisyContainer>
      <div tw="flex flex-col justify-between sm:flex-row">
        <HiddenFileInput
          {...folderCtrl.field}
          {...folderCtrl.fieldState}
          label="Upload static website"
          required
          isFolder
        >
          Select folder <Icon name="arrow-up" tw="ml-4" />
        </HiddenFileInput>
        {folderCtrl.field.value && (
          //<div tw="mt-4 sm:mt-0">
          <div tw="mt-4 sm:mt-0">
            <TextInput label="Size" name="size" value={folderSize} disabled />
          </div>
        )}
      </div>
      {cidCtrl.field.value && (
        <div tw="mt-6">
          <div className="tp-info text-main0">IPFS CID (Unpinned)</div>
          <IconText
            iconName="copy"
            onClick={() => copyAndNotify(cidCtrl.field.value)}
          >
            {cidCtrl.field.value}
          </IconText>
        </div>
      )}
    </NoisyContainer>
  )
})
AddWebsiteFolder.displayName = 'AddWebsiteFolder'

export default AddWebsiteFolder
