import { addClasses } from '@aleph-front/core'
import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledAmountInputContainer = styled.div`
  ${tw`relative`}
`

export const StyledAmountInputWrapper = styled.div`
  ${tw`relative w-full bg-purple-600 p-6`}
  min-height: 10rem;
  border-radius: 0;
`

export const StyledDollarSymbol = styled.div`
  ${tw`absolute bottom-6 left-6 text-purple-900 font-bold`}
  font-size: 2rem;
  font-family: 'rigid-square', monospace;
`

export const StyledAmountInput = styled.input.attrs(addClasses('tp-header'))`
  ${tw`w-full bg-transparent border-none outline-none text-white text-right`}
  font-size: 4rem;
  font-family: 'rigid-square', monospace;
  padding-right: 0;

  &::placeholder {
    ${tw`text-white opacity-70`}
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
`

export const StyledBonusText = styled.div`
  ${tw`absolute bottom-6 right-6 text-purple-200 text-12`}
  font-family: 'rigid-square', monospace;
`

export const StyledReceiveBox = styled.div`
  ${tw`w-full bg-purple-800 p-4 flex justify-between items-end`}
  border-radius: 0;
  margin-top: 0.5rem;
`

export const StyledReceiveLabel = styled.div`
  ${tw`text-purple-300 text-12 font-bold`}
  font-family: 'rigid-square', monospace;
`

export const StyledReceiveAmount = styled.div`
  ${tw`text-white text-18 font-bold`}
  font-family: 'rigid-square', monospace;
`
