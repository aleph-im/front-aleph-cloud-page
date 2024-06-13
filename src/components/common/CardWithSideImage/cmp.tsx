import React, { memo } from 'react'
import { CardWithSideImageProps } from './types'
import { Col, Row } from '@aleph-front/core'
import Image from 'next/image'

export const CardWithSideImage = ({
  children,
  imageSrc,
  imageAlt,
  imagePosition,
  cardBackgroundColor,
  reverseColumnsWhenStacked,
}: CardWithSideImageProps) => {
  const imageCmp = (
    <Image src={imageSrc} alt={imageAlt} fill={true} tw="relative!" />
  )

  const cardCmp = (
    <Col>
      <div className={cardBackgroundColor} tw="p-6">
        {children}
      </div>
    </Col>
  )

  return (
    <>
      {imagePosition === 'left' ? (
        <Row xs={1} md={2} gap="1.5rem">
          {reverseColumnsWhenStacked ? (
            <Col tw="order-last md:order-first">{imageCmp}</Col>
          ) : (
            <Col>{imageCmp}</Col>
          )}

          {cardCmp}
        </Row>
      ) : (
        <Row xs={1} md={2} gap="1.5rem">
          {cardCmp}
          {reverseColumnsWhenStacked ? (
            <Col tw="order-first md:order-last">{imageCmp}</Col>
          ) : (
            <Col>{imageCmp}</Col>
          )}
        </Row>
      )}
    </>
  )
}

export default memo(CardWithSideImage) as typeof CardWithSideImage
