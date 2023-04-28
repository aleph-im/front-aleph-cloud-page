import 'styled-components'
import { CoreTheme } from '@aleph-front/aleph-core'

declare module 'styled-components' {
  export type DefaultTheme = CoreTheme
}
