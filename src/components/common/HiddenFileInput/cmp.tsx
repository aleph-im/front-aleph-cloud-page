import React, {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useRef,
} from 'react'
import { Button, FormError, FormLabel, Icon } from '@aleph-front/aleph-core'
import { HiddenFileInputProps } from './types'
import { StyledHiddenFileInput } from './styles'
import { ellipseAddress } from '@/helpers/utils'

export const HiddenFileInput = memo(
  forwardRef(
    (
      {
        onChange,
        accept,
        value,
        children,
        error,
        label,
        required,
        directory
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
          // @note: This is verbose to avoid a type error on e.target.files[0] being undefined
          const target = e.target as HTMLInputElement
          const { files } = target

          if(!files) return
          if (files?.length === 1) {
            const fileUploaded = files[0]
            onChange(fileUploaded)
          }
          else if (files?.length > 1) {
            onChange(files)
          }
        },
        [onChange],
      )
      // @note: This is needed to forward a non-standard attribute to the DOM
      const castedDirectory = directory ? 'true' : undefined

      const displayName = value instanceof File ? value.name : value instanceof FileList ? value[0].webkitRelativePath : ''

      return (
        <div tabIndex={-1} ref={ref}>
          {label && <FormLabel label={label} error={error} required />}

          {value ? (
            <Button
              onClick={handleRemoveFile}
              type="button"
              color="main2"
              kind="neon"
              size="regular"
              variant="tertiary"
            >
              {ellipseAddress(displayName)} <Icon name="trash" tw="ml-5" />
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
            directory={castedDirectory}
            webkitDirectory={castedDirectory}
          />
        </div>
      )
    },
  ),
)
HiddenFileInput.displayName = 'HiddenFileInput'

export default HiddenFileInput
