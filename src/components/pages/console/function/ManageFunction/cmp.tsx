import Link from 'next/link'
import Head from 'next/head'
import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { Label, NoisyContainer, Tabs, Tooltip } from '@aleph-front/core'
import { EntityType } from '@/helpers/constants'
import { Button, Icon, Tag, TextGradient } from '@aleph-front/core'
import { useManageFunction } from './hook'
import {
  ellipseText,
  humanReadableSize,
  convertByteUnits,
} from '@/helpers/utils'
import { Text, Separator } from '../../common'
import { CenteredContainer } from '@/components/common/CenteredContainer'
import VolumeList from '../../volume/VolumeList'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import BackButtonSection from '@/components/common/BackButtonSection'
import LogsFeed from '@/components/common/LogsFeed'
import ManageEntityHeader from '@/components/common/entityData/ManageEntityHeader'

export default function ManageFunction() {
  const {
    //Basic data
    program,
    name,
    labelVariant,
    isPersistent,

    // Status data
    status,
    isAllocated,

    // Button states
    startDisabled,
    stopDisabled,
    rebootDisabled,
    deleteDisabled,

    nodeDetails,
    tabs,
    tabId,
    logs,
    setTabId,

    // Action handlers
    handleStart,
    handleStop,
    handleReboot,
    handleDelete,
    handleDownload,
    handleCopyHash,
    handleCopyCode,
    handleCopyRuntime,
    handleBack,
  } = useManageFunction()

  const theme = useTheme()

  // if (!program) {
  //   return (
  //     <>
  //       <BackButtonSection handleBack={handleBack} />
  //       <CenteredContainer>
  //         <NoisyContainer tw="my-4">Loading...</NoisyContainer>
  //       </CenteredContainer>
  //     </>
  //   )
  // }

  // const typeName = EntityTypeName[program.type]
  // const volumes = program.volumes

  return (
    <>
      <ManageEntityHeader
        entity={program}
        name={name}
        type={EntityType.Program}
        labelVariant={labelVariant}
        isAllocated={isAllocated}
        // Start action
        showStart={isPersistent}
        startDisabled={startDisabled}
        onStart={handleStart}
        // Delete action
        showDelete
        deleteDisabled={deleteDisabled}
        onDelete={handleDelete}
        // Stop action
        showStop={isPersistent}
        stopDisabled={stopDisabled}
        onStop={handleStop}
        // Reboot action
        showReboot={isPersistent}
        rebootDisabled={rebootDisabled}
        onReboot={handleReboot}
        // Download action
        showDownload
        downloadDisabled={false}
        onDownload={handleDownload}
        // Go back action
        onBack={handleBack}
      />
    </>
  )

  return (
    <>
      <Head>
        <title>Console | Manage Function - Aleph Cloud</title>
        <meta
          name="description"
          content="Manage your serverless function on Aleph Cloud"
        />
      </Head>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <CenteredContainer>
          <div tw="flex justify-between pb-5 flex-wrap gap-4 flex-col md:flex-row">
            <div tw="flex items-center">
              <Icon name="alien-8bit" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{name}</div>
              <Label
                kind="secondary"
                variant={
                  program.time < Date.now() - 1000 * 45 && isAllocated
                    ? 'success'
                    : 'warning'
                }
                tw="ml-4"
              >
                {isAllocated ? (
                  'READY'
                ) : (
                  <div tw="flex items-center">
                    <div tw="mr-2">CONFIRMING</div>
                    <RotatingLines
                      strokeColor={theme.color.base2}
                      width=".8rem"
                    />
                  </div>
                )}
              </Label>
            </div>
            <div tw="flex gap-4">
              {isPersistent && (
                <>
                  <Tooltip
                    content="Stop Function"
                    my="bottom-center"
                    at="top-center"
                  >
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleStop}
                      disabled={stopDisabled}
                    >
                      <Icon name="stop" />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Reallocate Function"
                    my="bottom-center"
                    at="top-center"
                  >
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleStart}
                      disabled={startDisabled}
                    >
                      <Icon name="play" />
                    </Button>
                  </Tooltip>

                  <Tooltip
                    content="Reboot Function"
                    my="bottom-center"
                    at="top-center"
                  >
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleReboot}
                      disabled={rebootDisabled}
                    >
                      <Icon name="arrow-rotate-backward" />
                    </Button>
                  </Tooltip>
                </>
              )}
              <Button
                size="md"
                variant="tertiary"
                color="main0"
                kind="default"
                forwardedAs="a"
                onClick={handleDownload}
              >
                <Icon name="download" />
              </Button>
              <Button
                kind="functional"
                variant="error"
                size="md"
                onClick={handleDelete}
              >
                <Icon name="trash" />
              </Button>
            </div>
          </div>

          <NoisyContainer>
            <div tw="flex items-center justify-start overflow-hidden">
              <Tag variant="accent" tw="mr-4 whitespace-nowrap">
                {typeName}
              </Tag>
              <div tw="flex-auto">
                <div className="tp-info text-main0">ITEM HASH</div>
                <IconText iconName="copy" onClick={handleCopyHash}>
                  {program.id}
                </IconText>
              </div>
            </div>

            <Separator />

            <div tw="flex flex-wrap justify-start gap-5 my-5">
              <div>
                <div className="tp-info text-main0">CORES</div>
                <div>
                  <Text>{program.resources.vcpus} x86 64bit</Text>
                </div>
              </div>

              <div>
                <div className="tp-info text-main0">RAM</div>
                <div>
                  <Text>
                    {convertByteUnits(program.resources.memory, {
                      from: 'MiB',
                      to: 'GiB',
                      displayUnit: true,
                    })}
                  </Text>
                </div>
              </div>

              <div>
                <div className="tp-info text-main0">TIMEOUT</div>
                <div>
                  <Text>{`${program.resources.seconds}s`}</Text>
                </div>
              </div>

              <div>
                <div className="tp-info text-main0">SIZE</div>
                <div>
                  <Text className="fs-10 tp-body1">
                    {humanReadableSize(program?.size || 0, 'MiB')}
                  </Text>
                </div>
              </div>

              <div>
                <div className="tp-info text-main0">CREATED ON</div>
                <div>
                  <Text className="fs-10 tp-body1">{program.date}</Text>
                </div>
              </div>
            </div>

            <div tw="my-5">
              <div className="tp-info text-main0">EXPLORER</div>
              <div>
                <a
                  className="tp-body1 fs-16"
                  href={program.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{ellipseText(program.url, 80)}</Text>
                  </IconText>
                </a>
              </div>
            </div>

            <div tw="my-5">
              <span className="tp-info text-main0">API ENTRYPOINT</span>
              <div>
                <a
                  className="tp-body1 fs-16"
                  href={program.urlVM}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <IconText iconName="square-up-right">
                    <Text>{ellipseText(program.urlVM, 80)}</Text>
                  </IconText>
                </a>
              </div>
            </div>

            <Separator />

            {isPersistent && (
              <Tabs
                selected={tabId}
                align="left"
                onTabChange={setTabId}
                tabs={tabs}
              />
            )}

            <div role="tabpanel" tw="mt-6">
              {tabId === 'detail' ? (
                <>
                  <div tw="my-5">
                    <TextGradient type="h7" as="h2" color="main0">
                      Linked Runtime
                    </TextGradient>

                    <div tw="my-5">
                      <div className="tp-info text-main0">ITEM HASH</div>
                      <div>
                        <IconText iconName="copy" onClick={handleCopyRuntime}>
                          {program.runtime.ref}
                        </IconText>
                      </div>
                    </div>

                    <div tw="my-5">
                      <div className="tp-info text-main0">COMMENT</div>
                      <div>
                        <Text>{program.runtime.comment}</Text>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div tw="my-5">
                    <TextGradient type="h7" as="h2" color="main0">
                      Linked Codebase
                    </TextGradient>

                    <div tw="my-5">
                      <div className="tp-info text-main0">IMMUTABLE VOLUME</div>
                      <div>
                        <Link
                          className="tp-body1 fs-16"
                          href={`/storage/volume/${program.code.ref}`}
                        >
                          <IconText iconName="square-up-right">
                            Volume details
                          </IconText>
                        </Link>
                      </div>
                    </div>

                    <div tw="my-5">
                      <div className="tp-info text-main0">ITEM HASH</div>
                      <div>
                        <IconText iconName="copy" onClick={handleCopyCode}>
                          {program.code.ref}
                        </IconText>
                      </div>
                    </div>

                    {program.code.entrypoint && (
                      <div tw="mt-5">
                        <div className="tp-info text-main0">
                          CODE ENTRYPOINT
                        </div>
                        <div>
                          <Text>{program.code.entrypoint}</Text>
                        </div>
                      </div>
                    )}
                  </div>

                  {nodeDetails && (
                    <>
                      <Separator />

                      <TextGradient type="h7" as="h2" color="main0">
                        Current CRN
                      </TextGradient>

                      <div tw="my-5">
                        <div className="tp-info text-main0">NAME</div>
                        <div>
                          <Text>{nodeDetails.name}</Text>
                        </div>
                      </div>

                      <div tw="my-5">
                        <div className="tp-info text-main0">URL</div>
                        <div>
                          <a
                            className="tp-body1 fs-16"
                            href={nodeDetails.url}
                            target="_blank"
                            referrerPolicy="no-referrer"
                          >
                            <IconText iconName="square-up-right">
                              <Text>{ellipseText(nodeDetails.url, 80)}</Text>
                            </IconText>
                          </a>
                        </div>
                      </div>
                    </>
                  )}

                  {volumes.length > 0 && (
                    <>
                      <Separator />

                      <TextGradient type="h7" as="h2" color="main0">
                        Linked Storage(s)
                      </TextGradient>

                      <VolumeList {...{ volumes }} />
                    </>
                  )}
                </>
              ) : tabId === 'log' ? (
                <>
                  <LogsFeed logs={logs} />
                </>
              ) : (
                <></>
              )}
            </div>
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink
              variant="primary"
              href="/console/computing/function/new"
            >
              Create new function
            </ButtonLink>
          </div>
        </CenteredContainer>
      </section>
    </>
  )
}
