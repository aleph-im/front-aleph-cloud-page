import { DefaultTheme, css } from 'styled-components'
import {
  ThemeBreakpoint,
  ThemeButton,
  ThemeColor,
  ThemeFont,
  ThemeGradient,
  ThemeIcon,
  ThemeFormInput,
  ThemeStorybookConfig,
  ThemeTransition,
  ThemeTypo,
  Typo,
  ThemeForm,
  ThemeFormFeedback,
  ThemeFormSelect,
  ThemeFormRadio,
  ThemeFormCheckbox,
  ThemeFormChip,
  ThemeComponent,
  ThemeBulletList,
  ThemeLabel,
  ThemeLogo,
  ThemeNotification,
  ThemeTab,
  ThemeTag,
  ThemeFormSwitch,
  ThemeSidebar,
  ThemeRouterLink,
  ThemeNavbar,
  ThemeNoisyContainer,
  ThemeButtonSchemaVariant,
  ThemeButtonSchema,
  ThemeWalletPicker,
  ThemeFooter,
  ThemeModal,
  ThemeFormFileInput,
} from './types'
import { getGlassEffectCss, pxToRem } from '@aleph-front/core'

const breakpoint: ThemeBreakpoint = {
  '2xl': pxToRem(1400),
  xl: pxToRem(1200),
  lg: pxToRem(992),
  md: pxToRem(768),
  sm: pxToRem(576),
  xs: pxToRem(0),
}

const color: ThemeColor = {
  white: '#141421',
  black: '#FFFFFF',
  translucid: '#1414210F',

  base0: '#141421',
  base1: '#141421',
  base2: '#FFFFFF',

  main0: '#D4FF00',
  main1: '#5100CD',

  purple0: '#F5EDFF',
  purple1: '#F1E9FD',
  purple2: '#EDE4FB',
  purple3: '#DBC8F6',
  purple4: '#C8ADF0',

  dark0: '#1414211A',
  dark1: '#1D1D2A',
  dark2: '#1F1F31',
  dark3: '#000000',

  light0: '#F9F4FF4D',
  light1: '#F9F4FF80',

  info: '#D4FF00',
  success: '#47FF59',
  warning: '#FECD17',
  error: '#D9245A',
  disabled: '#81818F',
  disabled2: '#14142120',

  background: '#141421',
  contentBackground: '#141421',
  foreground: '#141421',
  text: '#FFFFFF',
}

const gradient: ThemeGradient = {
  main0: {
    colors: ['#D6FF00', '#F5F7DB'],
    stops: [27.88, 100],
    deg: 90,
    fn: 'linear-gradient(90deg, #141421 27.88%, #5100CD 100%)',
  },
  main1: {
    colors: ['#141421', '#5100CD'],
    stops: [8.24, 71.81],
    deg: 90,
    fn: 'linear-gradient(90deg, #D6FF00 8.24%, #F5F7DB 71.81%)',
  },
  extra0: {
    colors: ['#D6FF0066', '#D2CCFB66'],
    stops: [19.1, 106.92],
    deg: 121,
    fn: 'linear-gradient(121deg, #D6FF0066 19.1%, #D2CCFB66 106.92%)',
  },
  info: {
    colors: ['#C8ADF0', '#5100CD'],
    stops: [22.66, 244.27],
    deg: 90,
    fn: 'linear-gradient(90deg, #C8ADF0 22.66%, #5100CD 244.27%)',
  },
  success: {
    colors: ['#38EC49', '#47FF59'],
    stops: [0, 100],
    deg: 90,
    fn: 'linear-gradient(90deg, #38EC49 0%, #47FF59 100%)',
  },
  warning: {
    colors: ['#FFE814', '#FBAE18'],
    stops: [0, 100],
    deg: 90,
    fn: 'linear-gradient(90deg, #FFE814 0%, #FBAE18 100%)',
  },
  error: {
    colors: ['#FFAC89', '#DE3668'],
    stops: [0, 90.62],
    deg: 90,
    fn: 'linear-gradient(90deg, #FFAC89 0%, #DE3668 90.62%)',
  },
  disabled: {
    colors: ['#81818F1A', '#81818F0A'],
    stops: [0, 90.62],
    deg: 90,
    fn: 'linear-gradient(90deg, #81818F1A 0%, #81818F0A 90.62%)',
  },

  info2: {
    colors: ['#C8ADF01A', '#5100CD1A'],
    stops: [22.66, 244.27],
    deg: 90,
    fn: 'linear-gradient(90deg, #C8ADF01A 22.66%, #5100CD1A 244.27%)',
  },
  success2: {
    colors: ['#38EC491A', '#47FF591A'],
    stops: [0, 100],
    deg: 90,
    fn: 'linear-gradient(90deg, #38EC491A 0%, #47FF591A 100%)',
  },
  warning2: {
    colors: ['#FFE8141A', '#FBAE181A'],
    stops: [0, 100],
    deg: 90,
    fn: 'linear-gradient(90deg, #FFE8141A 0%, #FBAE181A 100%)',
  },
  error2: {
    colors: ['#FFAC891A', '#DE36681A'],
    stops: [0, 90.62],
    deg: 90,
    fn: 'linear-gradient(90deg, #FFAC891A 0%, #DE36681A 90.62%)',
  },
}

const shadows = {
  purple0: '0px 4px 24px #5100cd26',
  purple1: '0px 4px 24px #5100cd73',
  purple2: '0px 4px 4px #5100cd26',
}

const font: ThemeFont = {
  urls: [
    'https://use.typekit.net/acb7qvn.css',
    'https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,400;0,700;1,400;1,700&family=Source+Code+Pro:wght@400;700&display=swap',
  ],
  family: {
    head: "'rigid-square', sans-serif",
    body: "'Titillium Web', sans-serif",
    code: "'Source Code Pro', monospace",
  },
  size: {
    '28': pxToRem(28),
    '24': pxToRem(24),
    '18': pxToRem(18),
    '16': pxToRem(16),
    '14': pxToRem(14),
    '12': pxToRem(12),
    '10': pxToRem(10),
  },
}

const defaultFontTypo: Typo = {
  tag: false,
  family: font.family.body,
  style: 'normal',
  weight: 400,
  lineHeight: 1.6,
  size: pxToRem(16),
}

const defaultHeaderFontTypo: Typo = {
  tag: true,
  family: font.family.head,
  style: 'italic',
  weight: 800,
  lineHeight: 'normal',
  size: pxToRem(16),
}

const typo: ThemeTypo = {
  h1: {
    ...defaultHeaderFontTypo,
    size: pxToRem(72),
  },
  h2: {
    ...defaultHeaderFontTypo,
    size: pxToRem(64),
  },
  h3: {
    ...defaultHeaderFontTypo,
    size: pxToRem(48),
  },
  h4: {
    ...defaultHeaderFontTypo,
    size: pxToRem(40),
  },
  h5: {
    ...defaultHeaderFontTypo,
    size: pxToRem(36),
  },
  h6: {
    ...defaultHeaderFontTypo,
    size: pxToRem(32),
  },
  h7: {
    ...defaultHeaderFontTypo,
    tag: false,
    size: pxToRem(24),
  },
  header: {
    ...defaultHeaderFontTypo,
    size: pxToRem(128),
  },
  logo: {
    ...defaultFontTypo,
    family: font.family.head,
    style: 'normal',
    weight: 900,
    size: pxToRem(34),
    spacing: '-0.05em',
  },
  nav: {
    ...defaultFontTypo,
    tag: true,
    family: font.family.head,
    weight: 700,
    lineHeight: 'normal',
    size: pxToRem(18),
  },
  info: {
    ...defaultFontTypo,
    family: font.family.head,
    style: 'italic',
    weight: 800,
    lineHeight: 'normal',
    size: pxToRem(10),
    transform: 'uppercase',
  },
  body: {
    ...defaultFontTypo,
    tag: true,
  },
  body1: {
    ...defaultFontTypo,
    style: 'italic',
  },
  body2: {
    ...defaultFontTypo,
    style: 'italic',
    weight: 700,
  },
  body3: {
    ...defaultFontTypo,
    weight: 700,
  },
  code: {
    ...defaultFontTypo,
    tag: true,
    family: font.family.code,
  },
  code1: {
    ...defaultFontTypo,
    family: font.family.code,
    weight: 700,
  },
  table: {
    ...defaultFontTypo,
    weight: 700,
    size: pxToRem(12),
  },
  form: {
    ...defaultFontTypo,
    tag: true,
  },
}

const transition: ThemeTransition = {
  duration: {
    slow: 700,
    normal: 500,
    fast: 200,
  },
  timing: 'ease-in-out',
}

const storybook: ThemeStorybookConfig = {
  color: {
    primary: '#0054ff',
    secondary: '#71c9fa',
    background: '#172025',
    contentBackground: '#1d2a31',
    foreground: '#2e363b',
    text: '#000000',
  },
}

const input: ThemeFormInput = {
  shadow: shadows.purple0,
  color: {
    default: color.text,
    data: color.main0,
  },
  background: {
    default: color.base0,
    data: color.purple3,
  },
  border: {
    color: color.text,
    size: 0,
    feedback: {
      size: pxToRem(1),
    },
    focus: {
      size: pxToRem(2),
    },
  },
}

const select: ThemeFormSelect = {
  option: {
    color: color.text,
    background: color.base0,
    selected: {
      color: color.base0,
      background: color.main0,
    },
  },
}

const switchcmp: ThemeFormSwitch = {
  disabledType: 'grayscale',
  shadow: shadows.purple0,
  dot: {
    background: color.text,
    checked: {
      background: color.main0,
    },
  },
  border: {
    color: color.text,
    size: pxToRem(1),
    focus: {
      color: color.text,
      size: pxToRem(2),
    },
    checked: {
      color: color.main0,
    },
  },
}

const radio: ThemeFormRadio = {
  disabledType: 'grayscale',
  shadow: shadows.purple0,
  background: color.translucid,
  dot: {
    background: color.white,
    checked: {
      background: gradient.main0,
    },
  },
  border: {
    color: color.purple4,
    size: pxToRem(3),
    focus: {
      color: color.text,
    },
    checked: {
      color: color.main0,
    },
  },
}

const checkbox: ThemeFormCheckbox = {
  disabledType: 'grayscale',
  shadow: shadows.purple0,
  background: color.translucid,
  check: {
    checked: {
      color: color.white,
      background: gradient.main0.fn,
    },
  },
  border: {
    color: color.purple4,
    size: pxToRem(3),
    focus: {
      color: color.text,
      size: pxToRem(3),
    },
    checked: {
      size: pxToRem(0),
    },
  },
}

const chip: ThemeFormChip = {
  background: color.main0,
  color: color.white,
  fontWeight: 'bold',
}

const file: ThemeFormFileInput = {
  color: color.text,
  background: gradient.info2.fn,
  border: `0.2rem dashed ${color.purple4}`,
  hover: {
    color: color.text,
    background: gradient.info.fn,
    border: `0.2rem dashed ${color.main0}`,
  },
}

const feedback: ThemeFormFeedback = {
  required: color.main0,
  warning: color.info,
  error: color.error,
}

const form: ThemeForm = {
  feedback,
  input,
  select,
  switch: switchcmp,
  radio,
  checkbox,
  chip,
  file,
}

// -------------------------------

const icon: ThemeIcon = {
  size: {
    '2xl': pxToRem(36),
    xl: pxToRem(24),
    lg: pxToRem(16),
    md: pxToRem(14),
    sm: pxToRem(12),
    xs: pxToRem(8),
  },
}

// ----------------------------------------------

const defaultButton: ThemeButtonSchemaVariant = {
  padding: '0.5rem 1.375rem',
  color: {
    default: color.text,
    disabled: color.disabled,
  },
  height: {
    sm: pxToRem(30),
    md: pxToRem(38),
    lg: pxToRem(45),
  },
  css: {
    hover: ($color: string) => css`
      filter: drop-shadow(0px 4px 24px ${color[$color]}46);
      /* filter: drop-shadow(0px 4px 24px ${color[$color]}26); */
      /* filter: drop-shadow(0px 4px 24px ${color[$color]}80); */
    `,
  },
  border: {
    type: 'full',
    size: {
      default: pxToRem(3),
      focus: pxToRem(3),
      disabled: pxToRem(3),
    },
    background: {
      disabled: color.disabled,
      focus: color.text,
    },
  },
  outline: {
    size: {
      default: pxToRem(0),
      focus: pxToRem(0),
      disabled: pxToRem(0),
    },
    color: {
      focus: color.base1,
    },
  },
  font: {
    family: font.family.head,
    style: 'normal',
    weight: 700,
    size: {
      sm: pxToRem(14),
      md: pxToRem(18),
      lg: pxToRem(24),
    },
  },
}

const primaryGradientButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  css: {
    hover: ($color: string) => css`
      filter: drop-shadow(0px 4px 24px ${color[$color]}80);
    `,
  },
  color: {
    ...defaultButton.color,
    default: color.white,
    disabled: color.white,
  },
  gradient: {
    ...defaultButton.gradient,
    default: true,
    disabled: color.disabled,
  },
  border: {
    ...defaultButton.border,
    size: {
      ...defaultButton.border.size,
      default: pxToRem(0),
      disabled: pxToRem(0),
    },
  },
}

const secondaryGradientButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  border: {
    ...defaultButton.border,
    gradient: {
      ...defaultButton.border.gradient,
      default: true,
    },
  },
}

const tertiaryGradientButton: ThemeButtonSchemaVariant = {
  ...secondaryGradientButton,
  transparency: '10',
  background: {
    ...secondaryGradientButton.background,
    default: true,
  },
}

const textOnlyGradientButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  border: {
    ...defaultButton.border,
    type: 'underscore',
    gradient: {
      ...defaultButton.border.gradient,
      default: true,
    },
  },
}

const GradientButton: ThemeButtonSchema = {
  primary: primaryGradientButton,
  secondary: secondaryGradientButton,
  tertiary: tertiaryGradientButton,
  textOnly: textOnlyGradientButton,
}

// -------------------------------

const primaryFlatButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  color: {
    ...defaultButton.color,
    default: color.white,
    disabled: color.white,
  },
  background: {
    ...defaultButton.background,
    default: true,
    disabled: color.disabled,
  },
  border: {
    ...defaultButton.border,
    size: {
      ...defaultButton.border.size,
      default: pxToRem(0),
      disabled: pxToRem(0),
    },
  },
}

const secondaryFlatButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  border: {
    ...defaultButton.border,
    background: {
      ...defaultButton.border.background,
      default: true,
    },
  },
}

const tertiaryFlatButton: ThemeButtonSchemaVariant = {
  ...secondaryFlatButton,
  transparency: '10',
  background: {
    ...secondaryFlatButton.background,
    default: true,
  },
}

const textOnlyFlatButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  border: {
    ...defaultButton.border,
    type: 'underscore',
    background: {
      ...defaultButton.border.background,
      default: true,
    },
  },
}

const flatButton: ThemeButtonSchema = {
  primary: primaryFlatButton,
  secondary: secondaryFlatButton,
  tertiary: tertiaryFlatButton,
  textOnly: textOnlyFlatButton,
}

// -------------------------------

const defaultYellowButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  css: {
    hover: () => css`
      filter: drop-shadow(0px 4px 24px ${color.main1}46);
    `,
  },
}

const primaryYellowButton: ThemeButtonSchemaVariant = {
  ...defaultYellowButton,
  color: {
    ...defaultYellowButton.color,
    disabled: color.white,
  },
  gradient: {
    ...defaultYellowButton.gradient,
    default: gradient.main1,
    disabled: color.disabled,
  },
  border: {
    ...defaultYellowButton.border,
    background: {
      ...defaultYellowButton.border.background,
      default: color.text,
    },
    size: {
      ...defaultYellowButton.border.size,
      disabled: pxToRem(0),
    },
  },
}

const secondaryYellowButton: ThemeButtonSchemaVariant = {
  ...defaultYellowButton,
  background: {
    ...defaultYellowButton.background,
    default: color.main1,
    disabled: 'transparent',
  },
  border: {
    ...defaultYellowButton.border,
    gradient: {
      ...defaultYellowButton.border.gradient,
      default: gradient.main1,
    },
  },
}

const tertiaryYellowButton: ThemeButtonSchemaVariant = {
  ...secondaryYellowButton,
  transparency: '10',
}

const textOnlyYellowButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  border: {
    ...defaultButton.border,
    type: 'underscore',
    gradient: {
      ...defaultButton.border.gradient,
      default: gradient.main1,
    },
  },
}

const yellowButton: ThemeButtonSchema = {
  primary: primaryYellowButton,
  secondary: secondaryYellowButton,
  tertiary: tertiaryYellowButton,
  textOnly: textOnlyYellowButton,
}
// -------------------------------

const primaryFunctionalButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  css: {
    hover: () => css`
      filter: drop-shadow(0px 4px 24px ${color.main0}80);
    `,
  },
  color: {
    ...defaultButton.color,
    default: color.white,
    disabled: color.white,
  },
  background: {
    ...defaultButton.background,
    default: color.text,
    disabled: color.disabled,
  },
  border: {
    ...defaultButton.border,
    size: {
      ...defaultButton.border.size,
      default: pxToRem(0),
      disabled: pxToRem(0),
    },
  },
}

const secondaryFunctionalButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  css: {
    hover: () => css`
      filter: drop-shadow(0px 4px 24px ${color.main0}46);
    `,
  },
  background: {
    ...defaultButton.background,
    default: color.base1,
    disabled: 'transparent',
  },
  border: {
    ...defaultButton.border,
    background: {
      ...defaultButton.border.background,
      default: color.text,
    },
  },
}

const errorFunctionalButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  css: {
    hover: () => css`
      filter: drop-shadow(0px 4px 24px ${color.error}80);
    `,
  },
  gradient: {
    ...defaultButton.gradient,
    default: gradient.error2,
    disabled: 'transparent',
  },
  background: {
    ...defaultButton.background,
    default: '#FAF6FF',
  },
  outline: {
    ...defaultButton.outline,
    size: {
      ...defaultButton.outline.size,
      focus: pxToRem(2),
    },
    color: {
      ...defaultButton.outline.color,
      focus: color.text,
    },
  },
  border: {
    ...defaultButton.border,
    gradient: {
      ...defaultButton.border.gradient,
      default: gradient.error,
      focus: gradient.error,
    },
  },
}

const warningFunctionalButton: ThemeButtonSchemaVariant = {
  ...errorFunctionalButton,
  css: {
    hover: () => css`
      filter: drop-shadow(0px 4px 24px ${color.warning}80);
    `,
  },
  gradient: {
    ...errorFunctionalButton.gradient,
    default: gradient.warning2,
  },
  border: {
    ...errorFunctionalButton.border,
    gradient: {
      ...errorFunctionalButton.border.gradient,
      default: gradient.warning,
      focus: gradient.warning,
    },
  },
}

const functionalButton: ThemeButtonSchema = {
  primary: primaryFunctionalButton,
  secondary: secondaryFunctionalButton,
  error: errorFunctionalButton,
  warning: warningFunctionalButton,
}

// -------------------------------

const primaryRoundedButton: ThemeButtonSchemaVariant = {
  ...defaultButton,
  padding: '0.5rem',
  color: {
    ...defaultButton.color,
    default: color.text,
    disabled: color.disabled,
  },
  background: {
    ...defaultButton.background,
    default: true,
  },
  border: {
    ...defaultButton.border,
    background: {
      default: color.text,
      focus: color.text,
      disabled: color.disabled,
    },
    size: {
      ...defaultButton.border.size,
      default: pxToRem(2),
      focus: pxToRem(3),
      disabled: pxToRem(2),
    },
  },
}

const roundedButton: ThemeButtonSchema = {
  primary: primaryRoundedButton,
}

// -------------------------------

const button: ThemeButton = {
  default: GradientButton,
  gradient: GradientButton,
  flat: flatButton,
  yellow: yellowButton,
  functional: functionalButton,
  rounded: roundedButton,
}

// -------------------------------
// -------------------------------

const bulletList: ThemeBulletList = {
  bullet: {
    info: {
      background: gradient.main0.fn,
    },
  },
}

const label: ThemeLabel = {
  color: {
    primary: color.text,
    secondary: color.text,
  },
}

const logo: ThemeLogo = {
  img: 'twentysix',
  text: 'twentysix',
  gap: '0.15em',
  by: {
    color: color.purple4,
  },
}

const notification: ThemeNotification = {
  color: color.text,
  background: {
    success: gradient.info.fn,
  },
}

const modal: ThemeModal = {
  color: color.text,
  background: color.base1,
  overlay: {
    background: color.main0 + '1A',
  },
}

const tab: ThemeTab = {
  color: {
    default: color.text,
    active: color.main0,
    disabled: color.dark0,
  },
}

const tag: ThemeTag = {
  variant: {
    default: {
      color: {
        text: color.text,
        background: color.purple3,
        border: '#EBDAFF',
      },
    },
    accent: {
      color: {
        text: color.white,
        background: color.main0,
        border: '#EBDAFF',
      },
    },
  },
}

const routerLink: ThemeRouterLink = {
  variant: {
    '1': {
      color: {
        default: color.white,
        hover: color.main1,
        active: color.main1,
        disabled: '#92929280',
      },
    },
    '2': {
      color: {
        default: color.white,
        hover: color.white,
        active: color.main1,
        disabled: '#92929280',
      },
      icon: {
        color: {
          default: color.white,
          hover: color.main1,
          active: color.main1,
          disabled: '#92929280',
        },
      },
    },
    '3': {
      underscore: true,
      color: {
        default: color.text,
        hover: color.main0,
        active: color.main0,
        disabled: '#92929280',
      },
    },
    '4': {
      background: {
        active: color.main1,
        disabled: 'transparent',
      },
      color: {
        default: color.white,
        hover: color.white,
        active: color.text,
        disabled: '#92929280',
      },
      icon: {
        color: {
          default: color.text,
          hover: color.main1,
          active: color.text,
          disabled: '#92929280',
        },
      },
    },
  },
}

const sidebar: ThemeSidebar = {
  nav1: {
    background: color.dark3,
    logo: {
      background: color.main1,
      padding: '2rem 0',
      size: pxToRem(38),
    },
    active: {
      background: color.dark2,
      background2: color.main1,
    },
  },
  nav2: {
    color: color.white,
    background: color.dark2,
    mainTitle: {
      color: color.light1,
    },
    title: {
      color: color.white,
      underline: color.main0,
    },
    progress: {
      color: color.main1,
    },
    toggle: {
      color: color.dark2,
      background: color.white,
    },
    active: {
      color: color.text,
      background: color.main1,
    },
  },
}

const navbar: ThemeNavbar = {
  logoText: true,
  color: color.text,
  tablet: {
    buttonColor: color.text,
  },
  mobile: {
    header: {
      shadow: shadows.purple0,
      css: () => getGlassEffectCss('base2'),
    },
    content: {
      css: () => getGlassEffectCss('base2'),
      color: color.white,
      background: color.text,
      child: {
        background: color.dark2,
        radius: pxToRem(0),
      },
    },
  },
}

const walletPicker: ThemeWalletPicker = {
  color: {
    default: color.text,
    disabled: color.text,
    rewards: color.main0,
  },
  background: '#14142105',
  shadow: shadows.purple0,
  border: {
    size: pxToRem(3),
    color: color.purple2,
  },
  button: {
    kind: () => 'rounded',
    variant: () => 'primary',
    color: (s) => (s ? color.main1 : color.base1),
  },
  button2: {
    kind: 'gradient',
    variant: 'secondary',
    color: 'main0',
    iconColor: color.text,
  },
  button3: {
    kind: 'functional',
    variant: 'primary',
  },
  button4: {
    kind: 'functional',
    variant: 'warning',
  },
  button5: {
    kind: 'yellow',
    variant: 'primary',
    color: 'main0',
  },
}

const noisyContainer: ThemeNoisyContainer = {
  default: 'grain-3',
  borderRadius: pxToRem(0),
}

const footer: ThemeFooter = {
  background: color.white,
  color: color.text,
  link: {
    gradient: gradient.main0,
  },
}

const component: ThemeComponent = {
  icon,
  button,
  bulletList,
  label,
  logo,
  notification,
  modal,
  tab,
  tag,
  routerLink,
  sidebar,
  navbar,
  walletPicker,
  noisyContainer,
  footer,
}

const theme: DefaultTheme = {
  name: 'twentysix-dark',
  color,
  font,
  typo,
  form,
  gradient,
  component,
  transition,
  breakpoint,
  storybook,
}

export default theme
