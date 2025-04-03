import { Container } from '@/components/pages/console/dashboard/common'
import {
  CardWithSideImage,
  NoisyContainer,
  TextGradient,
} from '@aleph-front/core'
import ButtonLink from '../ButtonLink'
import ExternalLinkButton from '../ExternalLinkButton'
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
  externalLinkText = 'Learn more',
  externalLinkUrl,
}: DashboardCardWithSideImageProps) => (
  <NoisyContainer type="grain-1" tw="py-20">
    <Container $variant="xl">
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
            {description}
          </div>
          {(withButton || externalLinkUrl) && (
            <div tw="mt-6 flex flex-wrap items-center justify-between gap-6">
              {withButton && buttonUrl && buttonText && (
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
    </Container>
  </NoisyContainer>
)

export default DashboardCardWithSideImage
