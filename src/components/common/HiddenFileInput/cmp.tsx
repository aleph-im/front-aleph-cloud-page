import React, { ChangeEvent, memo, useCallback, useRef } from 'react'
import { Button, FormError, Icon } from '@aleph-front/aleph-core'
import { HiddenFileInputProps } from './types'
import { StyledHiddenFileInput } from './styles'
import { ellipseAddress } from '@/helpers/utils'

export const HiddenFileInput = memo(
  ({ onChange, accept, value, children, error }: HiddenFileInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = useCallback(() => {
      if (!inputRef.current) return
      inputRef.current.click()
    }, [])

    const handleRemoveFile = useCallback(() => {
      onChange(undefined)
    }, [onChange])

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        // This is verbose to avoid a type error on e.target.files[0] being undefined
        const target = e.target as HTMLInputElement
        const { files } = target

        if (files) {
          const fileUploaded = files[0]
          onChange(fileUploaded)
        }
      },
      [onChange],
    )

    return (
      <>
        {value ? (
          <Button
            onClick={handleRemoveFile}
            type="button"
            color="main2"
            kind="neon"
            size="regular"
            variant="tertiary"
          >
            {ellipseAddress(value.name)} <Icon name="trash" tw="ml-5" />
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

        {error && <FormError error={error} />}

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
