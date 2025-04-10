import { ChangeEvent } from 'react'
import styled from 'styled-components'

interface StyledInputProps {
  type?: string
  ref: React.RefObject<HTMLInputElement>
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  accept: string | undefined
}

export const StyledHiddenFileInput = styled.input.attrs<StyledInputProps>({
  type: 'file',
})<StyledInputProps>`
  display: none;
`
