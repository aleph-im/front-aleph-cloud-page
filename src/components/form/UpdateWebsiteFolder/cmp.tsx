import React, { memo } from 'react'
import { FileInput } from '@aleph-front/core'
import { useAddWebsiteFolderProps } from '@/hooks/form/useAddWebsiteFolder'
import { UpdateWebsiteFolderProps } from './types'

export const UpdateWebsiteFolder = memo((props: UpdateWebsiteFolderProps) => {
  const { folderCtrl } = useAddWebsiteFolderProps(props)

  return (
    <FileInput
      {...folderCtrl.field}
      {...folderCtrl.fieldState}
      required
      directory
    />
  )
})
UpdateWebsiteFolder.displayName = 'UpdateWebsiteFolder'

export default UpdateWebsiteFolder
