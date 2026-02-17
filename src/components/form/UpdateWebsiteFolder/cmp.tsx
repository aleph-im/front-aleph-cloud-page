import React, { memo } from 'react'
import { FileInput, Spinner } from '@aleph-front/core'
import { useAddWebsiteFolderProps } from '@/hooks/form/useAddWebsiteFolder'
import { UpdateWebsiteFolderProps } from './types'

export const UpdateWebsiteFolder = memo((props: UpdateWebsiteFolderProps) => {
  const { folderCtrl, isUploading, uploadProgress, uploadError } =
    useAddWebsiteFolderProps(props)

  return (
    <>
      <FileInput
        {...folderCtrl.field}
        {...folderCtrl.fieldState}
        required
        directory
      />
      {isUploading && (
        <div tw="mt-2 flex items-center gap-2">
          <Spinner size="3rem" color="main0" />
          <span className="tp-info text-main0">
            Uploading... {uploadProgress}%
          </span>
        </div>
      )}
      {uploadError && (
        <div tw="mt-2">
          <span className="tp-info text-error">Error: {uploadError}</span>
        </div>
      )}
    </>
  )
})
UpdateWebsiteFolder.displayName = 'UpdateWebsiteFolder'

export default UpdateWebsiteFolder
