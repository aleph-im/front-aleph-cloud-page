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
import InfoTooltipButton from '../../InfoTooltipButton'

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

  const tooltipContent = (
    <>
      <p className="tp-body3 fs-18 text-base2" tw="mb-4">
        IPv4 Port Forwarding Details
      </p>
      <p className="tp-body2 fs-14">Randomized Source Ports:</p>
      <p className="tp-body1 fs-14">
        Source (external) ports are automatically assigned and may change
        whenever the instance or function is reallocated. Always refer to the
        instance detail page to verify current mappings.
      </p>
      <p className="tp-body2 fs-14" tw="mt-4">
        Port Limits:
      </p>
      <p className="tp-body1 fs-14">
        You can specify up to 20 internal ports per instance or function. Ensure
        you enter ports relevant to your service to maintain effective network
        security and performance.
      </p>
    </>
  )

  return (
    <>
      <div className="tp-h7 fs-24" tw="flex items-center uppercase mb-2">
        <InfoTooltipButton
          plain
          my="top-right"
          at="top-right"
          vAlign="bottom"
          iconSize="0.9em"
          tooltipContent={tooltipContent}
        >
          IPV4 PORT FORWARDING
        </InfoTooltipButton>
      </div>
      <NoisyContainer>
        <div tw="flex flex-col gap-y-4">
          <div>
            <InfoTitle>CONFIGURED PORTS</InfoTitle>
            <Text>Maximum 20 ports allowed</Text>
          </div>
          {ports.map(
            ({ source, destination, tcp, udp, isDeletable, isRemoving }) => (
              <div
                key={`port-${source}`}
                tw="flex gap-4 items-center flex-wrap"
              >
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
                  <div
                    className="text-main0 fs-18"
                    tw=" font-bold self-end mb-3"
                  >
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
                        disabled={!!isRemoving}
                      >
                        <Icon
                          name={isRemoving ? 'spinner' : 'trash-xmark'}
                          spin={isRemoving}
                        />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
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
