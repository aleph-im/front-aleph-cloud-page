import 'styled-components'
import { CoreTheme } from '@aleph-front/aleph-core'
 
declare module 'styled-components' {
  export interface DefaultTheme extends CoreTheme {}
}
