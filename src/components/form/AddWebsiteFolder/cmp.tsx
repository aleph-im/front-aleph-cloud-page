import { Icon, Button, NoisyContainer, TextInput } from '@aleph-front/core'
import { RemoveWebsiteFolderProps, AddWebsiteFolderProps } from './types'
import React, { memo } from 'react'
import { useAddWebsiteFolderProps } from '@/hooks/form/useAddWebsiteFolder'

import HiddenFileInput from '@/components/common/HiddenFileInput'

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
  const { folderCtrl, folderSize } = useAddWebsiteFolderProps(props)

  return (
    <NoisyContainer
      css={`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      `}
    >
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
        <TextInput label="Size" name="size" value={folderSize} disabled />
      )}
    </NoisyContainer>
  )
})
AddWebsiteFolder.displayName = 'AddWebsiteFolder'

export default AddWebsiteFolder
