import { CenteredContainer } from '../CenteredContainer'
import {
  CardWithSideImage,
  NoisyContainer,
  TextGradient,
} from '@aleph-front/core'
import ButtonLink from '../ButtonLink'
import ExternalLinkButton from '../ExternalLinkButton'
import ExternalLink from '../ExternalLink'
import BorderBox from '../BorderBox'
import { DashboardCardWithSideImageProps } from './types'

export const DashboardCardWithSideImage = ({
  info,
  title,
  description,
  imageSrc,
  imageAlt,
  withButton = true,
  buttonUrl,
  buttonText,
  buttonIsExternal = false,
  externalLinkText = 'Learn more',
  externalLinkUrl,
}: DashboardCardWithSideImageProps) => (
  <NoisyContainer type="grain-1" tw="py-20">
    <CenteredContainer $variant="xl">
      <CardWithSideImage
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        cardBackgroundColor="bg-white"
      >
        <div tw="flex flex-col gap-16">
          <div>
            <div className="tp-info text-main0">{info}</div>
            <TextGradient as="h2" type="h3">
              {title}
            </TextGradient>
            <div className="tp-body1">{description}</div>
          </div>
          {buttonIsExternal && buttonUrl && (
            <BorderBox $color="warning">
              <p className="tp-body1 fs-16 text-base2">
                Creating new resources is now available in the new Credits
                console.
              </p>
              <p className="tp-body1 fs-16 text-base2" tw="mt-2">
                <ExternalLink
                  href={buttonUrl}
                  text="Go to Credits console"
                  color="main0"
                  tw="font-bold"
                />
              </p>
            </BorderBox>
          )}
          {((!buttonIsExternal && withButton && buttonUrl && buttonText) ||
            externalLinkUrl) && (
            <div tw="flex flex-wrap items-center justify-between gap-6">
              {!buttonIsExternal && withButton && buttonUrl && buttonText && (
                <ButtonLink variant="primary" size="md" href={buttonUrl}>
                  {buttonText}
                </ButtonLink>
              )}
              {externalLinkUrl && (
                <ExternalLinkButton href={externalLinkUrl}>
                  {externalLinkText}
                </ExternalLinkButton>
              )}
            </div>
          )}
        </div>
      </CardWithSideImage>
    </CenteredContainer>
  </NoisyContainer>
)

export default DashboardCardWithSideImage
