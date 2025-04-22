import React, {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useRef,
} from 'react'
import { FormError, FormLabel } from '@aleph-front/core'
import { HiddenFileInputProps } from './types'
import { StyledHiddenFileInput } from './styles'

export const HiddenFileInput = forwardRef(
  (
    {
      value,
      onChange,
      accept,
      children,
      error,
      label,
      resetValue = '',
      ...rest
    }: HiddenFileInputProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = useCallback(() => {
      if (!inputRef.current) return

      if (resetValue !== undefined && value && value !== resetValue) {
        inputRef.current.value = ''
        onChange(resetValue)
        return
      }

      inputRef.current.click()
    }, [onChange, resetValue, value])

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
      <div tabIndex={-1} ref={ref} onClick={handleClick} {...rest}>
        {label && <FormLabel label={label} error={error} required />}
        {children}
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

export default memo(HiddenFileInput)
