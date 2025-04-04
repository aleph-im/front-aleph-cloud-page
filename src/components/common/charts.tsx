import { useTheme } from 'styled-components'

export type SVGGradientsProps = {
  data: {
    gradient?: string | { colors: string[]; deg: number; stops: number[] }
    color?: string
  }[]
}

export function SVGGradients({ data }: SVGGradientsProps) {
  const theme = useTheme()

  return (
    <>
      {data
        .filter((entry) => !!entry.gradient)
        .map((entry, index) => {
          if (!entry.gradient) return null

          const { colors, deg, stops } =
            typeof entry.gradient === 'string'
              ? theme.gradient[entry.gradient]
              : entry.gradient

          const key =
            typeof entry.gradient === 'string'
              ? `gr-${entry.gradient}`
              : `gr-${index}`

          return (
            <linearGradient
              key={key}
              id={key}
              gradientTransform={`rotate(${deg + -90} 0.5 0.5)`}
            >
              {colors.map((color, index) => (
                <stop
                  key={color}
                  offset={`${stops[index]}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          )
        })}
    </>
  )
}
