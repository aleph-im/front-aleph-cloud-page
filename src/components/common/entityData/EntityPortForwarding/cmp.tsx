import { memo } from 'react'
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
import { useEntityPortForwarding } from './hook'
import AddPortForm from './AddPortForm'

export const EntityPortForwarding = ({
  entityHash,
  executableStatus,
  executableManager,
}: EntityPortForwardingProps) => {
  const {
    // State
    showPortForm,
    ports,
    // Actions
    handleAddPort,
    handleCancelAddPort,
    handleRemovePort,
    handleSubmitNewPorts,
  } = useEntityPortForwarding({
    entityHash,
    executableStatus,
    executableManager,
  })

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
          {ports.map(({ source, destination, tcp, udp, isDeletable }) => (
            <div key={`port-${source}`} tw="flex gap-4 items-center flex-wrap">
              <div tw="flex gap-4 items-center">
                <div tw="flex flex-col gap-3">
                  <Text>Source</Text>
                  <TextInput
                    name="source-port"
                    dataView
                    defaultValue={source}
                    required
                    width="6em"
                    textAlign="center"
                  />
                </div>
                <div className="text-main0 fs-18" tw=" font-bold self-end mb-3">
                  {'-'}
                </div>
                <div tw="flex flex-col gap-3">
                  <Text>Destination</Text>
                  {/* @todo: Remove min-width prop from TextInput on front-core */}
                  <TextInput
                    name="destination-port"
                    dataView
                    defaultValue={destination}
                    required
                    width="6em"
                    textAlign="center"
                    loading={!destination}
                  />
                </div>
              </div>
              <div tw="flex gap-4 items-center">
                <div tw="flex flex-col gap-3">
                  <Text>TCP</Text>
                  <Checkbox disabled checked={tcp} />
                </div>
                <div tw="flex flex-col gap-3">
                  <Text>UDP</Text>
                  <Checkbox disabled checked={udp} />
                </div>
                {isDeletable && (
                  <div tw="self-end">
                    <Button
                      variant="warning"
                      kind="functional"
                      onClick={() => handleRemovePort(source)}
                    >
                      <Icon name="trash-xmark" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div tw="mt-2">
            {showPortForm ? (
              <AddPortForm
                onSubmit={handleSubmitNewPorts}
                onCancel={handleCancelAddPort}
              />
            ) : (
              <div tw="mt-2">
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
