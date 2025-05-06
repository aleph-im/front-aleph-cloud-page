import { ReactNode } from 'react'

export type EntityDataColumnsProps = {
  /**
   * Array of elements to render in the left column
   * Falsy elements will be filtered out
   */
  leftColumnElements: ReactNode[]

  /**
   * Array of elements to render in the right column
   * Falsy elements will be filtered out
   */
  rightColumnElements: ReactNode[]
}
