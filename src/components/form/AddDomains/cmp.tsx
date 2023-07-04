import React from 'react'
import { TextInput, Button } from '@aleph-front/aleph-core'
import NoisyContainer from '../../NoisyContainer'
import ExternalLinkButton from '@/components/ExternalLinkButton'

export const AddDomains = React.memo(() => {
  return (
    <>
      <NoisyContainer>
        <TextInput
          button={
            <Button
              color="main0"
              kind="neon"
              size="regular"
              variant="secondary"
              disabled
            >
              Add
            </Button>
          }
          buttonStyle="wrapped"
          color="white"
          name="__config_add_domain"
          placeholder="Enter custom domain"
          disabled
        />
      </NoisyContainer>
      <div tw="mt-6 text-right">
        <ExternalLinkButton href="https://docs.aleph.im" disabled>
          Learn more
        </ExternalLinkButton>
      </div>
    </>
  )
})
AddDomains.displayName = 'AddDomains'

export default AddDomains
