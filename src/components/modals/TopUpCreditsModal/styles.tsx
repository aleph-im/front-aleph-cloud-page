import { addClasses, Radio, RadioGroup } from '@aleph-front/core'
import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledSendBox = styled.div.attrs(addClasses('bg-purple1'))`
  ${tw`p-4`}
`

export const StyledSendTitle = styled.div.attrs(addClasses('text-purple4'))`
  ${tw`flex items-center gap-2 mb-2`}
`

export const StyledAmountInputWrapper = styled.div`
  ${tw`relative`}
`

export const StyledDollarSymbol = styled.div.attrs(
  addClasses('tp-h3 text-main0'),
)`
  ${tw`absolute bottom-4 left-0`}
  font-size: 3rem;
`

export const StyledAmountInput = styled.input.attrs(
  addClasses('tp-header text-main0'),
)`
  ${tw`w-full p-0 pl-12 bg-transparent border-none outline-none text-right`}
  font-size: 8rem;

  &::placeholder {
    color: ${({ theme }) => theme.color.purple3};
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

export const StyledBonusText = styled.div.attrs(
  addClasses('tp-body2 text-main0'),
)`
  ${tw`text-18 flex items-center justify-end opacity-50`}
  min-height: 1rem;
  line-height: 1em;
`

export const StyledReceiveBox = styled.div.attrs(
  addClasses('bg-purple3 text-main0'),
)`
  ${tw`p-4 flex justify-between items-end min-h-[1rem]`}
`

export const StyledReceiveLabel = styled.div.attrs(
  addClasses('tp-header text-main0'),
)`
  ${tw`text-10 flex items-center gap-1.5`}
`

export const StyledReceiveAmount = styled.div.attrs(
  addClasses('tp-h7 text-main0'),
)`
  ${tw`text-24 flex items-center justify-end`}
  line-height: 1em;
`

export const StyledRadioGroup = styled(RadioGroup)`
  & > div {
    ${tw`gap-0!`}
  }
`

export const StyledRadio = styled(Radio)`
  ${tw`w-full px-3 border-t-2`}
  border-color: ${({ theme }) => theme.color.purple2};

  &:last-child {
    ${tw`border-b-2`}
  }

  & > label {
    ${tw`w-full py-3`}
  }

  &:has(input:checked) {
    background-color: ${({ theme }) => theme.color.purple1};
  }
`
