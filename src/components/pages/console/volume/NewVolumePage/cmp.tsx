import React from 'react'
import Head from 'next/head'
import { PaymentMethod } from '@/helpers/constants'
import { useNewVolumePage } from './hook'
import CheckoutSummary from '@/components/form/CheckoutSummary'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { AddNewVolume } from '@/components/form/AddVolume'
import { Form } from '@/components/form/Form'
import { SectionTitle } from '@/components/common/CompositeTitle'
import BackButtonSection from '@/components/common/BackButtonSection'
import ButtonWithInfoTooltip from '@/components/common/ButtonWithInfoTooltip'
import { insufficientFundsDisabledMessage } from './disabledMessages'

export function NewVolumePage() {
  const {
    control,
    address,
    accountBalance,
    isCreateButtonDisabled,
    errors,
    cost,
    handleSubmit,
    handleBack,
  } = useNewVolumePage()

  return (
    <>
      <Head>
        <title>Console | New Volume - Aleph Cloud</title>
        <meta
          name="description"
          content="Create a new persistent storage volume on Aleph Cloud"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <SectionTitle number="1">Add volume</SectionTitle>
            <AddNewVolume control={control} />
          </CenteredContainer>
        </section>
        <CheckoutSummary
          address={address}
          cost={cost}
          unlockedAmount={accountBalance}
          paymentMethod={PaymentMethod.Hold}
          description={
            <>
              This amount needs to be present in your wallet until the volume is
              removed. Tokens won &#39;t be locked nor consumed. The volume will
              be garbage collected once funds are removed from the wallet.
            </>
          }
          button={
            <ButtonWithInfoTooltip
              type="submit"
              color="main0"
              kind="default"
              size="lg"
              variant="primary"
              disabled={isCreateButtonDisabled}
              tooltipContent={
                isCreateButtonDisabled
                  ? insufficientFundsDisabledMessage()
                  : undefined
              }
              tooltipPosition={{
                my: 'bottom-center',
                at: 'top-center',
              }}
            >
              Create volume
            </ButtonWithInfoTooltip>
          }
        />
      </Form>
    </>
  )
}

export default React.memo(NewVolumePage)
