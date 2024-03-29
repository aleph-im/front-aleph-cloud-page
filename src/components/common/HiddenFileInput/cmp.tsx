import React, {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
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
      <div tabIndex={-1} ref={ref}>
        {label && <FormLabel label={label} error={error} required />}

        {value ? (
          <Button
            type="button"
            kind="functional"
            variant="warning"
            size="md"
            onClick={handleRemoveFile}
          >
            {ellipseAddress(value.name)} <Icon name="trash" tw="ml-5" />
          </Button>
        ) : (
          <Button
            onClick={handleClick}
            type="button"
            color="main0"
            kind="default"
            size="md"
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
      </div>
    )
  },
)
HiddenFileInput.displayName = 'HiddenFileInput'

export default memo(HiddenFileInput) as typeof HiddenFileInput
