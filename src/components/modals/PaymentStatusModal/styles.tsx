import { addClasses, Radio } from '@aleph-front/core'
import styled from 'styled-components'
import tw from 'twin.macro'

export const StyledProgressContainer = styled.ul`
  ${tw`flex flex-col gap-5 py-4 px-6 mb-4`}
`

export const StyledProgressStep = styled.li`
  ${tw`flex items-center gap-4`}
`

export const StyledProgressStepIcon = styled(Radio)`
  ${tw`flex-none pointer-events-none`}
`

export const StyledProgressContent = styled.div`
  ${tw`flex-auto`}
`

export const StyledProgressTitle = styled.p.attrs(
  addClasses('tp-body2 fs-18 text-text'),
)<{ completed: boolean }>`
  ${tw`m-0`}
  color: ${({ completed, theme }) =>
    completed ? theme.color.text : theme.color.disabled};
`

export const StyledProgressDescription = styled.p.attrs(
  addClasses('tp-body fs-12 text-text'),
)`
  ${tw`m-0`}
`
