import React from 'react'
import { useRef } from 'react'
import Head from 'next/head'
import { NoisyContainer, TooltipProps, TextInput } from '@aleph-front/core'
import ButtonWithInfoTooltip from '@/components/common/ButtonWithInfoTooltip'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import { useNewPermissionPage, UseNewPermissionPageReturn } from './hook'
import Form from '@/components/form/Form'
import { CompositeSectionTitle } from '@/components/common/CompositeTitle'
import { PageProps } from '@/types/types'
import BackButtonSection from '@/components/common/BackButtonSection'
import BorderBox from '@/components/common/BorderBox'
import FloatingFooter from '@/components/form/FloatingFooter'
import PermissionsConfiguration from '@/components/form/PermissionsConfiguration'

const CheckoutButton = React.memo(
  ({
    disabled,
    title = 'Save permissions',
    tooltipContent,
    isFooter,
    handleSubmit,
  }: {
    disabled: boolean
    title?: string
    tooltipContent?: TooltipProps['content']
    isFooter: boolean
    handleSubmit: UseNewPermissionPageReturn['handleSubmit']
  }) => {
    const checkoutButtonRef = useRef<HTMLButtonElement>(null)

    return (
      <ButtonWithInfoTooltip
        ref={checkoutButtonRef}
        type="submit"
        color="main0"
        kind="default"
        size="lg"
        variant="primary"
        disabled={disabled}
        tooltipContent={tooltipContent}
        tooltipPosition={{
          my: isFooter ? 'bottom-right' : 'bottom-center',
          at: isFooter ? 'top-right' : 'top-center',
        }}
        onClick={handleSubmit}
      >
        {title}
      </ButtonWithInfoTooltip>
    )
  },
)
CheckoutButton.displayName = 'CheckoutButton'

export default function NewInstancePage({ mainRef }: PageProps) {
  const {
    createPermissionDisabled,
    createPermissionDisabledMessage,
    createPermissionButtonTitle,
    control,
    errors,
    handleSubmit,
    handleBack,
    addressCtrl,
    aliasCtrl,
    isDirty,
  } = useNewPermissionPage()

  return (
    <>
      <Head>
        <title>Console | New Permission | Aleph Cloud</title>
        <meta
          name="description"
          content="Delegate permissions to your resources in Aleph Cloud"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <Form onSubmit={handleSubmit} errors={errors}>
        {createPermissionDisabledMessage && (
          <section tw="px-0 pt-20 pb-6 md:py-10">
            <CenteredContainer>
              <BorderBox $color="warning">
                {createPermissionDisabledMessage}
              </BorderBox>
            </CenteredContainer>
          </section>
        )}
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={1}>Recipient</CompositeSectionTitle>

            <div tw="px-0 mt-12 mb-6 min-h-[6rem] relative">
              <NoisyContainer>
                <div className="bg-light1" tw="p-6 flex flex-col gap-y-4">
                  <TextInput
                    {...addressCtrl.field}
                    {...addressCtrl.fieldState}
                    label="Recipient account address"
                    required
                    placeholder="Wallet address 0x..."
                  />
                  <TextInput
                    {...aliasCtrl.field}
                    {...aliasCtrl.fieldState}
                    label="Account alias"
                    required
                    placeholder="Alias (for your reference)"
                  />
                </div>
              </NoisyContainer>
            </div>
          </CenteredContainer>
        </section>
        <section tw="px-0 pt-20 pb-6 md:py-10">
          <CenteredContainer>
            <CompositeSectionTitle number={2}>
              Permissions
            </CompositeSectionTitle>
            <p className="tp-body1">
              Select what this account may do and revoke access at any time.
            </p>
            <div tw="mt-6">
              <PermissionsConfiguration control={control} />
            </div>
          </CenteredContainer>
        </section>
        <FloatingFooter
          containerRef={mainRef}
          shouldHide={false}
          shouldRender={isDirty}
        >
          <div tw="flex justify-end items-center w-full py-4 px-6">
            <CheckoutButton
              disabled={createPermissionDisabled}
              title={createPermissionButtonTitle}
              tooltipContent={createPermissionDisabledMessage}
              isFooter
              handleSubmit={handleSubmit}
            />
          </div>
        </FloatingFooter>
      </Form>
    </>
  )
}
