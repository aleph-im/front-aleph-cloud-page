import React, { memo } from 'react'
import { PermissionsDetailProps } from './types'
import { NoisyContainer, ObjectImg } from '@aleph-front/core'
import CopyToClipboard from '../CopyToClipboard'
import Form from '@/components/form/Form'
import { usePermissionsDetailForm } from './hook'
import PermissionsConfiguration from '@/components/form/PermissionsConfiguration'

export const PermissionsDetail = ({
  permissions,
  onSubmit,
  onUpdate,
  channelsPanelOrder = 1,
}: PermissionsDetailProps) => {
  const { handleSubmit, errors, control } = usePermissionsDetailForm({
    permissions,
    onSubmitSuccess: onSubmit,
    onUpdate,
  })

  return (
    <>
      <Form
        tw="overflow-y-auto"
        id="permissions-detail-form"
        onSubmit={handleSubmit}
        errors={errors}
      >
        <div tw="flex flex-col gap-y-12">
          <div tw="flex flex-col gap-y-2">
            <div className="tp-info fs-14">Recipient details</div>
            <NoisyContainer>
              <div tw="flex gap-x-4">
                <div>
                  <ObjectImg id="Object12" size={90} color="main0" />
                </div>
                <div tw="flex flex-col gap-y-2">
                  {/* <div>
                <div className="tp-info fs-10 text-main0">Created at</div>
                <div className="tp-body2">
                  {permissions.created_at || 'Unknown'}
                </div>
              </div> */}
                  <div>
                    <div className="tp-info fs-10 text-main0">
                      Recipient account address
                    </div>
                    <div>
                      <CopyToClipboard
                        text={
                          <span className="tp-body1 fs-12">
                            {permissions.id}
                          </span>
                        }
                        textToCopy={permissions.id}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="tp-info fs-10 text-main0">
                      Recipient alias
                    </div>
                    <div className="tp-body2">{permissions.alias || '-'}</div>
                  </div>
                </div>
              </div>
            </NoisyContainer>
          </div>
          <div tw="flex flex-col gap-y-2">
            <div className="tp-info fs-14">Permissions details</div>
            <PermissionsConfiguration
              control={control}
              name=""
              channelsPanelOrder={channelsPanelOrder}
            />
          </div>
        </div>
      </Form>
    </>
  )
}
PermissionsDetail.displayName = 'PermissionsDetail'

export default memo(PermissionsDetail) as typeof PermissionsDetail
