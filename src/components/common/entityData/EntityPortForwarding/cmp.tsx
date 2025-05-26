import { memo, useCallback, useState } from 'react'
import {
  Button,
  Checkbox,
  Icon,
  NoisyContainer,
  TextInput,
} from '@aleph-front/core'
import { Text } from '@/components/pages/console/common'
import { EntityPortForwardingProps } from './types'
import InfoTitle from '../InfoTitle'

export const EntityPortForwarding = ({}: EntityPortForwardingProps) => {
  const [showAddPort, setShowAddPort] = useState(false)
  const handleAddPort = useCallback(() => setShowAddPort(true), [])
  const handleCancelAddPort = useCallback(() => setShowAddPort(false), [])

  return (
    <>
      <div className="tp-h7 fs-24" tw="uppercase mb-2">
        IPV4 PORT FORWARDING
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-y-4">
          <div>
            <InfoTitle>CONFIGURED PORTS</InfoTitle>
            <Text>Maximum 20 ports allowed</Text>
          </div>
          <div tw="flex gap-4 items-center">
            <div tw="flex flex-col gap-3">
              <Text>Source</Text>
              {/* @todo: Remove min-width prop from TextInput on front-core */}
              <TextInput
                // {...nameCtrl.field}
                // {...nameCtrl.fieldState}
                dataView
                defaultValue="80"
                required
              />
            </div>
            <div className="text-main0 fs-18" tw=" font-bold self-end mb-3">
              {'-'}
            </div>
            <div tw="flex flex-col gap-3">
              <Text>Destination</Text>
              {/* @todo: Remove min-width prop from TextInput on front-core */}
              <TextInput
                // {...nameCtrl.field}
                // {...nameCtrl.fieldState}
                dataView
                defaultValue="28743"
                required
              />
            </div>
            <div tw="flex flex-col gap-3">
              <Text>UDP</Text>
              <Checkbox disabled />
            </div>
            <div tw="flex flex-col gap-3">
              <Text>TCP</Text>
              <Checkbox disabled checked />
            </div>
            <div tw="self-end mb-1">
              <Button
                variant="warning"
                kind="functional"
                // onClick={handleRemovePort}
              >
                <Icon name="trash-xmark" />
              </Button>
            </div>
          </div>
          <div>
            {showAddPort ? (
              <>
                <div tw="mt-2 px-4 py-3" className="bg-background">
                  <div tw="flex gap-4 items-center">
                    <div tw="flex flex-col gap-3">
                      <Text>Port</Text>
                      {/* @todo: Remove min-width prop from TextInput on front-core */}
                      <TextInput
                        // {...nameCtrl.field}
                        // {...nameCtrl.fieldState}
                        placeholder="8080"
                        required
                      />
                    </div>
                    <div tw="flex flex-col gap-3">
                      <Text>UDP</Text>
                      <Checkbox />
                    </div>
                    <div tw="flex flex-col gap-3">
                      <Text>TCP</Text>
                      <Checkbox />
                    </div>
                    <div tw="self-end mb-1">
                      <Button
                        variant="warning"
                        kind="functional"
                        onClick={handleCancelAddPort}
                      >
                        <Icon name="trash-xmark" />
                      </Button>
                    </div>
                  </div>
                  <div tw="mt-4">
                    <Button
                      variant="secondary"
                      kind="gradient"
                      // onClick={handleAddNewPort}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                <div tw="mt-4">
                  <Button
                    variant="primary"
                    kind="gradient"
                    // onClick={handleSaveNewPort}
                  >
                    Save
                  </Button>
                </div>
              </>
            ) : (
              <div tw="mt-4">
                <Button
                  variant="secondary"
                  kind="gradient"
                  onClick={handleAddPort}
                >
                  Add
                </Button>
              </div>
            )}
          </div>
        </div>
      </NoisyContainer>
    </>
  )
}
EntityPortForwarding.displayName = 'EntityPortForwarding'

export default memo(EntityPortForwarding) as typeof EntityPortForwarding
