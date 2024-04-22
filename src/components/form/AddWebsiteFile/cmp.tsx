import { Icon, Button, NoisyContainer } from '@aleph-front/core'
import { RemoveWebsiteFileProps, AddWebsiteFileProps } from './types'
import React, { memo } from 'react'
import { useAddWebsiteFileProps } from '@/hooks/form/useAddWebsiteFile'

import HiddenFileInput from '@/components/common/HiddenFileInput'

const RemoveWebsite = memo(
  ({ onRemove: handleRemove }: RemoveWebsiteFileProps) => {
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

export const AddWebsiteFile = memo((props: AddWebsiteFileProps) => {
  const { fileCtrl } = useAddWebsiteFileProps(props)

  return (
    <NoisyContainer>
      <HiddenFileInput
        {...fileCtrl.field}
        {...fileCtrl.fieldState}
        label="Upload build folder"
        required
      >
        Upload folder <Icon name="arrow-up" tw="ml-4" />
      </HiddenFileInput>
    </NoisyContainer>
  )
})
AddWebsiteFile.displayName = 'AddWebsiteFile'

export default AddWebsiteFile
