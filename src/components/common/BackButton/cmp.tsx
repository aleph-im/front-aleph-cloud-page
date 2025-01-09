import { Button, Icon } from '@aleph-front/core'
import { BackButtonProps } from './types'

export const BackButton = ({ handleBack }: BackButtonProps) => (
  <Button kind="functional" variant="textOnly" onClick={handleBack}>
    <p
      className="tp-info text-base2"
      tw="flex items-center justify-center text-center gap-1"
    >
      <Icon name="arrow-left" /> Back
    </p>
  </Button>
)

export default BackButton
