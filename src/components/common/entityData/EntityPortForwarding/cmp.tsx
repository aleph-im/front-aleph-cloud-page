import { memo, useCallback, useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  Icon,
  NoisyContainer,
  TextInput,
} from '@aleph-front/core'
import { Text } from '@/components/pages/console/common'
import {
  EntityPortForwardingProps,
  ForwardedPort,
  NewForwardedPortEntry,
} from './types'
import InfoTitle from '../InfoTitle'

export const EntityPortForwarding = ({}: EntityPortForwardingProps) => {
  const [showAddPort, setShowAddPort] = useState(false)
  const [ports, setPorts] = useState<ForwardedPort[]>([
    {
      source: '2222',
      destination: '28741',
      tcp: true,
      udp: true,
      isDeletable: false,
    },
    {
      source: '80',
      destination: '28743',
      tcp: true,
      udp: false,
      isDeletable: true,
    },
  ])
  const [newPorts, setNewPorts] = useState<NewForwardedPortEntry[]>([])

  const addNewEmptyPort = useCallback(() => {
    const newPort: NewForwardedPortEntry = {
      id: Date.now().toString(),
      port: '',
      udp: false,
      tcp: false,
    }
    setNewPorts((prev) => [...prev, newPort])
  }, [])

  const handleAddPort = useCallback(() => {
    setShowAddPort(true)
    addNewEmptyPort()
  }, [addNewEmptyPort])

  const handleCancelAddPort = useCallback(() => {
    setShowAddPort(false)
    setNewPorts([])
  }, [])

  const handleRemovePort = useCallback((source: string) => {
    setPorts((prev) => prev.filter((port) => port.source !== source))
  }, [])

  const handleRemoveNewPort = useCallback((id: string) => {
    setNewPorts((prev) => prev.filter((port) => port.id !== id))
  }, [])

  const handleUpdateNewPort = useCallback(
    (
      id: string,
      field: keyof Omit<NewForwardedPortEntry, 'id'>,
      value: string | boolean,
    ) => {
      setNewPorts((prev) =>
        prev.map((port) =>
          port.id === id ? { ...port, [field]: value } : port,
        ),
      )
    },
    [],
  )

  const isValidPort = useCallback((port: string) => {
    const portNum = parseInt(port, 10)
    return !isNaN(portNum) && portNum > 0 && portNum <= 65535
  }, [])

  const isValidPortEntry = useCallback(
    (port: NewForwardedPortEntry) => {
      return isValidPort(port.port) && (port.udp || port.tcp)
    },
    [isValidPort],
  )

  const disabledSaveNewPorts = useMemo(
    () => !newPorts.length || !newPorts.every(isValidPortEntry),
    [newPorts, isValidPortEntry],
  )

  const handleSaveNewPorts = useCallback(() => {
    if (disabledSaveNewPorts) return

    // @todo: Implement actual save logic here
    console.log('Saving ports:', newPorts)
    setShowAddPort(false)
    setPorts((prev) => [
      ...prev,
      ...newPorts.map((port) => ({
        source: port.port,
        destination: port.port, // Assuming destination is the same as source for new ports
        tcp: port.tcp,
        udp: port.udp,
        isDeletable: true, // New ports are deletable
      })),
    ])
    setNewPorts([])
  }, [newPorts, disabledSaveNewPorts])

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
          {ports.map(
            ({ source, destination, tcp, udp, isDeletable }, index) => (
              <div key={`port-${index}`} tw="flex gap-4 items-center flex-wrap">
                <div tw="flex gap-4 items-center">
                  <div tw="flex flex-col gap-3">
                    <Text>Source</Text>
                    {/* @todo: Remove min-width prop from TextInput on front-core */}
                    <TextInput
                      name="source-port"
                      dataView
                      defaultValue={source}
                      required
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
            ),
          )}
          <div tw="mt-2">
            {showAddPort ? (
              <>
                {newPorts.map((port) => (
                  <div
                    key={port.id}
                    tw="mt-2 px-4 py-3 w-fit"
                    className="bg-background"
                  >
                    <div tw="flex gap-4 items-center">
                      <div tw="flex flex-col gap-3">
                        <Text>Port</Text>
                        <TextInput
                          name={`new-port-${port.id}`}
                          value={port.port}
                          onChange={(e) =>
                            handleUpdateNewPort(port.id, 'port', e.target.value)
                          }
                          placeholder="8080"
                          required
                          error={
                            port.port && !isValidPort(port.port)
                              ? { message: 'Invalid port number (1-65535)' }
                              : undefined
                          }
                        />
                      </div>
                      <div tw="flex flex-col gap-3">
                        <Text>TCP</Text>
                        <Checkbox
                          checked={port.tcp}
                          onChange={(e) =>
                            handleUpdateNewPort(
                              port.id,
                              'tcp',
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                      <div tw="flex flex-col gap-3">
                        <Text>UDP</Text>
                        <Checkbox
                          checked={port.udp}
                          onChange={(e) =>
                            handleUpdateNewPort(
                              port.id,
                              'udp',
                              e.target.checked,
                            )
                          }
                        />
                      </div>

                      <div tw="self-end mb-1">
                        <Button
                          variant="warning"
                          kind="functional"
                          onClick={() => handleRemoveNewPort(port.id)}
                        >
                          <Icon name="trash-xmark" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div tw="mt-4 flex gap-2">
                  <Button
                    variant="secondary"
                    kind="gradient"
                    onClick={handleAddPort}
                  >
                    Add
                  </Button>
                  {newPorts.length > 0 && (
                    <Button
                      variant="primary"
                      kind="gradient"
                      onClick={handleSaveNewPorts}
                      disabled={disabledSaveNewPorts}
                    >
                      Save
                    </Button>
                  )}
                  <Button variant="tertiary" onClick={handleCancelAddPort}>
                    Cancel
                  </Button>
                </div>
              </>
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
