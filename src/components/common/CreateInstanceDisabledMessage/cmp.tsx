import { memo } from 'react'
import BorderBox from '@/components/common/BorderBox'
import { CreateInstanceDisabledMessageProps } from './types'

export const CreateInstanceDisabledMessage = ({
  title,
  description,
}: CreateInstanceDisabledMessageProps) => {
  return (
    <BorderBox $color="warning">
      <p className="tp-body3 fs-18 text-base2">{title}</p>
      <p className="tp-body1 fs-14 text-base2">{description}</p>
    </BorderBox>
  )
}

CreateInstanceDisabledMessage.displayName = 'CreateInstanceDisabledMessage'

export default memo(CreateInstanceDisabledMessage)
