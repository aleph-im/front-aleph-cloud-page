import {
  FlattenInterpolation,
  FlattenSimpleInterpolation,
  SimpleInterpolation,
} from 'styled-components'

export type CssOutput =
  | string
  | FlattenInterpolation<any>
  | FlattenSimpleInterpolation
  | SimpleInterpolation
  | undefined

export type BreakpointId = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ThemeBreakpoint = Record<BreakpointId, number>

export type TypoSizeKind = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TypoSize = Record<TypoSizeKind, number>

export type TypoKind =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'h7'
  | 'header'
  | 'logo'
  | 'nav'
  | 'info'
  | 'body'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'code'
  | 'code1'
  | 'table'
  | 'form'
export type Typo = {
  tag: boolean
  size: number
  family: string
  weight: number
  style: 'normal' | 'italic'
  lineHeight: number | string | 'normal'
  spacing?: string
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
}
export type ThemeTypo = Record<TypoKind, Typo>

export type Gradient = {
  colors: string[]
  stops: number[]
  deg: number
  fn: string
}

export type ThemeGradient = {
  [k: string]: Gradient

  main0: Gradient
  main1: Gradient

  info: Gradient
  success: Gradient
  warning: Gradient
  error: Gradient
  disabled: Gradient
}

export type ThemeColor = {
  [k: string]: string

  white: string
  black: string
  translucid: string

  base0: string
  base1: string
  base2: string

  main0: string
  main1: string

  info: string
  success: string
  warning: string
  error: string
  disabled: string
  disabled2: string

  background: string
  contentBackground: string
  foreground: string
  text: string
}

export type ThemeFont = {
  urls: string[]
  size: {
    [k: string]: number

    '28': number
    '24': number
    '18': number
    '16': number
    '12': number
    '10': number
  }
  family: {
    head: string
    body: string
    code: string
  }
}

// -----------------------------------

export type ThemeTransition = {
  duration: {
    slow: number
    normal: number
    fast: number
  }
  timing: string
}

// -----------------------------------

export type ThemeStorybookConfig = {
  color: {
    primary: string
    secondary: string
    background: string
    contentBackground: string
    foreground: string
    text: string
  }
}

// -----------------------------------

export type ThemeFormInput = {
  shadow: string
  color: {
    default: string
    data: string
  }
  background: {
    default: string
    data: string
  }
  border: {
    color: string
    size: number
    feedback: {
      size: number
    }
    focus: {
      size: number
    }
  }
}

export type ThemeFormSelect = {
  option: {
    border?: string
    color: string
    background: string
    selected: {
      color: string
      background: string
      shadow?: string
    }
  }
}

export type ThemeFormSwitch = {
  disabledType?: 'opacity' | 'grayscale'
  shadow?: string
  dot: {
    shadow?: string
    background: string
    checked: {
      background: string | Gradient
    }
  }
  border: {
    color: string
    size: number
    focus: {
      color: string
      size: number
    }
    checked: {
      color: string
    }
  }
}

export type ThemeFormRadio = {
  disabledType?: 'opacity' | 'grayscale'
  shadow?: string
  background: string
  dot: {
    background: string
    checked: {
      background: string | Gradient
    }
  }
  border: {
    color: string
    size: number
    focus: {
      color: string
    }
    checked: {
      color: string
    }
  }
}

export type ThemeFormCheckbox = {
  disabledType?: 'opacity' | 'grayscale'
  shadow?: string | ((...args: any[]) => string)
  background: string
  check: {
    checked: {
      color: string
      background?: string
      shadow?: (...args: any[]) => string
    }
  }
  border: {
    color: string
    size: number
    focus: {
      color: string
      size: number
    }
    checked: {
      size: number
    }
  }
}

export type ThemeFormChip = {
  background: string
  color: string
  fontWeight?: string
}

export type ThemeFormFileInput = {
  color: string
  background: string
  border: string
  hover: {
    color: string
    background: string
    border: string
  }
}

export type ThemeFormFeedback = {
  required: string
  warning: string
  error: string
}

export type ThemeForm = {
  feedback: ThemeFormFeedback
  input: ThemeFormInput
  select: ThemeFormSelect
  switch: ThemeFormSwitch
  radio: ThemeFormRadio
  checkbox: ThemeFormCheckbox
  chip: ThemeFormChip
  file: ThemeFormFileInput
}

// -----------------------------------

export type ThemeIcon = {
  size: {
    '2xl': number
    xl: number
    lg: number
    md: number
    sm: number
    xs: number
  }
}

// -----------------------------------

export type ThemeButtonSchemaSize = 'sm' | 'md' | 'lg'

export type ThemeButtonSchemaVariant = {
  height: Record<ThemeButtonSchemaSize, number>
  padding: string
  color?: {
    default?: string
    disabled?: string
  }
  transparency?: string
  background?: {
    default?: boolean | string
    focus?: boolean | string
    disabled?: boolean | string
  }
  gradient?: {
    default?: boolean | string | Gradient
    focus?: boolean | string | Gradient
    disabled?: boolean | string | Gradient
  }
  css?: {
    default?: (...args: any[]) => CssOutput
    hover?: (...args: any[]) => CssOutput
    active?: (...args: any[]) => CssOutput
  }
  outline: {
    size?: {
      default?: number
      focus?: number
      disabled?: number
    }
    color?: {
      default?: string
      focus?: string
      disabled?: string
    }
  }
  border: {
    type: 'full' | 'underscore'
    transparency?: string
    background?: {
      default?: boolean | string
      focus?: boolean | string
      disabled?: boolean | string
    }
    gradient?: {
      default?: boolean | string | Gradient
      focus?: boolean | string | Gradient
      disabled?: boolean | string | Gradient
    }
    size: {
      default?: number
      focus?: number
      disabled?: number
    }
  }
  font: {
    family?: string
    weight?: number
    style?: string
    size: Record<ThemeButtonSchemaSize, number>
  }
}

export type ThemeButtonSchema = {
  [variant: string]: ThemeButtonSchemaVariant
  primary: ThemeButtonSchemaVariant
}

export type ThemeButton = {
  [kind: string]: ThemeButtonSchema
  default: ThemeButtonSchema
}

// -----------------------------------

export type BulletListCheck = {
  background?: string
  shadow?: string
  css?: (...args: any[]) => CssOutput
}

export type ThemeBulletList = {
  bullet: {
    [kind: string]: BulletListCheck
    // kind: info | success | warning | error
  }
}

export type ThemeLabel = {
  color: {
    primary: string
    secondary: string
  }
}

export type ThemeLogo = {
  img: string
  text: string
  gap?: string
  by?: {
    color: string
  }
}

export type ThemeNotification = {
  color: string
  background?: {
    [kind: string]: string
    // kind: success | warning | error
  }
}

export type ThemeModal = {
  color: string
  background: string
  overlay: {
    background: string
  }
}

export type ThemeTab = {
  color: {
    default: string
    active: string
    disabled: string
    label?: string
  }
}

export type ThemeTag = {
  variant: Record<
    string,
    {
      color: {
        border: string
        text: string
        background: string
      }
    }
  >
}

export type RouterLinkVariantProps = {
  background?: {
    default?: string
    hover?: string
    active?: string
    disabled?: string
  }
  color?: {
    default?: string
    hover?: string
    active?: string
    disabled?: string
  }
}

export type RouterLinkVariant = RouterLinkVariantProps & {
  underscore?: boolean
  icon?: RouterLinkVariantProps
  text?: RouterLinkVariantProps
}

export type ThemeRouterLink = {
  variant: Record<string, RouterLinkVariant>
}

export type ThemeSidebar = {
  nav1: {
    background: string
    logo: {
      background?: string
      size: number
      padding: string
    }
    active: {
      background?: string
      background2?: string
    }
  }
  nav2: {
    color: string
    background: string
    mainTitle?: {
      color: string
    }
    title?: {
      color: string
      underline: string
    }
    progress: {
      color: string
    }
    toggle: {
      color: string
      background: string
    }
    active?: {
      color?: string
      background?: string
    }
  }
}

export type ThemeNavbar = {
  logoText: boolean
  color: string
  tablet?: {
    buttonColor?: string
  }
  mobile: {
    header: {
      background?: string
      shadow?: string
      css?: (...args: any[]) => CssOutput
      open?: {
        background: string
      }
    }
    content: {
      color: string
      background?: string
      shadow?: string
      css?: (...args: any[]) => CssOutput
      child: {
        background: string
        radius: number
      }
    }
  }
}

export type ThemeWalletPicker = {
  color: {
    default: string
    disabled: string
    rewards: string
  }
  background: string
  shadow: string
  border: {
    size: number
    color: string
  }
  button: {
    kind: (isSelected: boolean) => string
    variant: (isSelected: boolean) => string
    color: (isSelected: boolean) => string
  }
  button2: {
    kind: string
    variant: string
    color?: string
    iconColor?: string
  }
  button3: {
    kind: string
    variant: string
    color?: string
  }
  button4: {
    kind: string
    variant: string
    color?: string
  }
  button5: {
    kind: string
    variant: string
    color?: string
  }
}

export type ThemeNoisyContainer = {
  default: string
  borderRadius: number
}

export type ThemeFooter = {
  background: string
  color: string
  link: {
    gradient: Gradient
  }
}

export type ThemeComponent = {
  icon: ThemeIcon
  button: ThemeButton
  bulletList: ThemeBulletList
  label: ThemeLabel
  logo: ThemeLogo
  notification: ThemeNotification
  modal: ThemeModal
  tab: ThemeTab
  tag: ThemeTag
  routerLink: ThemeRouterLink
  sidebar: ThemeSidebar
  navbar: ThemeNavbar
  walletPicker: ThemeWalletPicker
  noisyContainer: ThemeNoisyContainer
  footer: ThemeFooter
}

// -----------------------------------

export interface CoreTheme {
  name: string
  font: ThemeFont
  color: ThemeColor
  typo: ThemeTypo
  form: ThemeForm
  component: ThemeComponent
  gradient: ThemeGradient
  transition: ThemeTransition
  breakpoint: ThemeBreakpoint
  storybook: ThemeStorybookConfig
}
