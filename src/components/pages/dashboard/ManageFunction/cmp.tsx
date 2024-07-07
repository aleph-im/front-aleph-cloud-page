import Link from 'next/link'
import ButtonLink from '@/components/common/ButtonLink'
import IconText from '@/components/common/IconText'
import { Label, NoisyContainer } from '@aleph-front/core'
import { EntityTypeName } from '@/helpers/constants'
import { Button, Icon, Tag, TextGradient } from '@aleph-front/core'
import { useManageFunction } from '@/hooks/pages/solutions/manage/useManageFunction'
import {
  ellipseAddress,
  ellipseText,
  humanReadableSize,
  convertByteUnits,
} from '@/helpers/utils'
import { Container, Text, Separator } from '../common'
import VolumeList from '../VolumeList'
import { RotatingLines } from 'react-loader-spinner'
import { useTheme } from 'styled-components'
import BackButtonSection from '@/components/common/BackButtonSection'

export default function ManageFunction() {
  const {
    program,
    handleDelete,
    handleDownload,
    handleCopyHash,
    handleCopyCode,
    handleCopyRuntime,
    handleBack,
  } = useManageFunction()

  const theme = useTheme()

  if (!program) {
    return (
      <>
        <BackButtonSection handleBack={handleBack} />
        <Container>
          <NoisyContainer tw="my-4">Loading...</NoisyContainer>
        </Container>
      </>
    )
  }

  const name = (program?.metadata?.name as string) || ellipseAddress(program.id)
  const typeName = EntityTypeName[program.type]
  const volumes = program.volumes

  return (
    <>
      <BackButtonSection handleBack={handleBack} />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon name="alien-8bit" tw="mr-4" className="text-main0" />
              <div className="tp-body2">{name}</div>
              <Label
                kind="secondary"
                variant={program.confirmed ? 'success' : 'warning'}
                tw="ml-4"
              >
                {program.confirmed ? (
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
            <div tw="flex flex-wrap justify-end gap-2 sm:gap-4">
              <Button
                size="md"
                variant="tertiary"
                color="main0"
                kind="default"
                forwardedAs="a"
                onClick={handleDownload}
              >
                Download
              </Button>
              <Button
                kind="functional"
                variant="warning"
                size="md"
                onClick={handleDelete}
              >
                Delete
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
            <div tw="flex flex-wrap justify-between gap-2">
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
            <TextGradient type="h7" as="h2" color="main0">
              Linked Runtime
            </TextGradient>
            <div className="tp-info text-main0">ITEM HASH</div>
            <IconText iconName="copy" onClick={handleCopyRuntime}>
              {program.runtime.ref}
            </IconText>
            {program.runtime.comment && (
              <div tw="mt-5">
                <div className="tp-info text-main0">COMMENT</div>
                <Text>{program.runtime.comment}</Text>
              </div>
            )}
            <Separator />
            <TextGradient type="h7" as="h2" color="main0">
              Linked Codebase
            </TextGradient>
            <div tw="my-5">
              <div className="tp-info text-main0">IMMUTABLE VOLUME</div>
              <Link
                className="tp-body1 fs-16"
                href={`/storage/volume/${program.code.ref}`}
              >
                <IconText iconName="square-up-right">Volume details</IconText>
              </Link>
            </div>
            <div className="tp-info text-main0">ITEM HASH</div>
            <IconText iconName="copy" onClick={handleCopyCode}>
              {program.code.ref}
            </IconText>
            {program.code.entrypoint && (
              <div tw="mt-5">
                <div className="tp-info text-main0">CODE ENTRYPOINT</div>
                <Text>{program.code.entrypoint}</Text>
              </div>
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
          </NoisyContainer>

          <div tw="mt-20 text-center">
            <ButtonLink variant="primary" href="/computing/function/new">
              Create new function
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  )
}
