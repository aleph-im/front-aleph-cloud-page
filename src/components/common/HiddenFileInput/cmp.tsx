import React, {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { Button, FormError, FormLabel, Icon } from '@aleph-front/core'
import { HiddenFileInputProps } from './types'
import { StyledHiddenFileInput } from './styles'
import { ellipseAddress } from '@/helpers/utils'

export const HiddenFileInput = forwardRef(
  (
    {
      onChange,
      accept,
      value,
      children,
      error,
      label,
      required,
      buttonStyle,
      isFolder,
    }: HiddenFileInputProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = useCallback(() => {
      if (!inputRef.current) return
      inputRef.current.click()
    }, [])

    const handleRemoveFile = useCallback(() => {
      if (!inputRef.current) return
      inputRef.current.value = ''
      onChange(undefined)
    }, [onChange])

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target as HTMLInputElement
        if (files) onChange(!isFolder ? files[0] : files)
      },
      [onChange, isFolder],
    )

    useEffect(() => {
      if (inputRef.current) {
        if (isFolder) {
          inputRef.current.setAttribute('directory', '')
          inputRef.current.setAttribute('webkitdirectory', '')
        } else {
          inputRef.current.removeAttribute('directory')
          inputRef.current.removeAttribute('webkitdirectory')
        }
      }
    }, [isFolder])

    return (
      <div tabIndex={-1} ref={ref}>
        {label && <FormLabel label={label} error={error} required />}
        {value ? (
          <Button
            type="button"
            kind="functional"
            variant="warning"
            size="md"
            {...buttonStyle}
            onClick={handleRemoveFile}
          >
            {!isFolder
              ? ellipseAddress((value as File).name)
              : value &&
                (value as FileList)[0]?.webkitRelativePath.split('/')[0]}
            <Icon name="trash" tw="ml-5" />
          </Button>
        ) : (
          <Button
            onClick={handleClick}
            type="button"
            kind="functional"
            size="md"
            variant="warning"
            {...buttonStyle}
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
          required={required}
        />
      </div>
    )
  },
)
HiddenFileInput.displayName = 'HiddenFileInput'

export default memo(HiddenFileInput) as typeof HiddenFileInput
