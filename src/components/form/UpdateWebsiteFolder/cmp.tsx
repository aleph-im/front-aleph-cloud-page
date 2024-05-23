import { UpdateWebsiteFolderProps } from './types'
import React, { memo } from 'react'
import { useAddWebsiteFolderProps } from '@/hooks/form/useAddWebsiteFolder'
import HiddenFileInput from '@/components/common/HiddenFileInput'

export const UpdateWebsiteFolder = memo((props: UpdateWebsiteFolderProps) => {
  const { folderCtrl } = useAddWebsiteFolderProps(props)

  return (
    <HiddenFileInput
      {...folderCtrl.field}
      {...folderCtrl.fieldState}
      required
      isFolder
    >
      Update
    </HiddenFileInput>
  )
})
UpdateWebsiteFolder.displayName = 'UpdateWebsiteFolder'

export default UpdateWebsiteFolder
