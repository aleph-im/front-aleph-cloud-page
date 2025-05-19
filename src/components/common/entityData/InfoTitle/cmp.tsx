import { memo } from 'react'
import { InfoTitleProps } from './types'

const InfoTitle = ({ children }: InfoTitleProps) => (
  <div className="tp-info text-main0 fs-12" tw="text-left">
    {children}
  </div>
)
InfoTitle.displayName = 'InfoTitle'

export default memo(InfoTitle) as typeof InfoTitle
