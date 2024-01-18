/* eslint-disable @typescript-eslint/no-empty-interface */
import 'styled-components'
import { CoreTheme } from '@aleph-front/core'

declare module 'styled-components' {
  export interface DefaultTheme extends CoreTheme {}
}
