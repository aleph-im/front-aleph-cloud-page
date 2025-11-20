// src/types/react-extra-props.d.ts
import 'react'

declare module 'react' {
  interface Attributes {
    tw?: string
    css?: any // tighten to your CSS type if you have one
    as?: React.ElementType
    forwardedAs?: React.ElementType
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      tw?: string
      css?: any
      as?: React.ElementType
      forwardedAs?: React.ElementType
    }
  }
}
