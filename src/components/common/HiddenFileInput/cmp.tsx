import React, { ChangeEvent, memo, useCallback, useRef, useState } from 'react'
import { Button, Icon } from '@aleph-front/aleph-core'
import { HiddenFileInputProps } from './types'
import { StyledHiddenFileInput } from './styles'
import { ellipseAddress } from '@/helpers/utils'

export const HiddenFileInput = memo(
  ({ onChange, accept, value, children }: HiddenFileInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [state, setState] = useState<File | undefined>(undefined)

    const file = value || state

    const handleClick = useCallback(() => {
      if (!inputRef.current) return
      inputRef.current.click()
    }, [])

    const handleRemoveFile = useCallback(() => {
      setState(undefined)
      onChange(undefined)
    }, [onChange])

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        // This is verbose to avoid a type error on e.target.files[0] being undefined
        const target = e.target as HTMLInputElement
        const { files } = target

        if (files) {
          const fileUploaded = files[0]
          setState(fileUploaded)
          onChange(fileUploaded)
        }
      },
      [onChange],
    )

    return (
      <>
        {file ? (
          <Button
            onClick={handleRemoveFile}
            type="button"
            color="main2"
            kind="neon"
            size="regular"
            variant="tertiary"
          >
            {ellipseAddress(file.name)} <Icon name="trash" tw="ml-5" />
          </Button>
        ) : (
          <Button
            onClick={handleClick}
            type="button"
            color="main0"
            kind="neon"
            size="regular"
            variant="primary"
          >
            {children}
          </Button>
        )}

        <StyledHiddenFileInput
          type="file"
          ref={inputRef}
          onChange={handleChange}
          accept={accept}
        />
      </>
    )
  },
)
HiddenFileInput.displayName = 'HiddenFileInput'

export default HiddenFileInput
