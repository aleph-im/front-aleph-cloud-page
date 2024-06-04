import React, { memo } from 'react'
import { Button, NoisyContainer, FileInput } from '@aleph-front/core'
import { RemoveWebsiteFolderProps, AddWebsiteFolderProps } from './types'
import { useAddWebsiteFolderProps } from '@/hooks/form/useAddWebsiteFolder'
import IconText from '@/components/common/IconText'

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
  const { folderCtrl, cidCtrl, handleCopyCID } = useAddWebsiteFolderProps(props)

  return (
    <NoisyContainer>
      <FileInput
        {...folderCtrl.field}
        {...folderCtrl.fieldState}
        label="Upload static website"
        required
        directory
      />
      {cidCtrl.field.value && (
        <div tw="mt-6">
          <div className="tp-info text-main0">IPFS CID (Unpinned)</div>
          <IconText iconName="copy" onClick={handleCopyCID}>
            {cidCtrl.field.value}
          </IconText>
        </div>
      )}
    </NoisyContainer>
  )
})
AddWebsiteFolder.displayName = 'AddWebsiteFolder'

export default AddWebsiteFolder
