import { colors, Colors } from '@/styles/colorPalette'
import { Typography, typographyMap } from '@/styles/typography'
import styled from '@emotion/styled'
import { CSSProperties } from 'react'

interface TextProps {
  typography?: Typography
  color?: Colors //지정한 color외도 받고 싶다면 Colors|string으로 해도 됨
  display?: CSSProperties['display'] //display속성들 받도록 타입지정
  textAlign?: CSSProperties['textAlign']
  fontWeight?: CSSProperties['fontWeight']
  bold?: boolean
}

const Text = styled.span<TextProps>(
  ({ color = 'black', display, textAlign, fontWeight, bold }) => ({
    color: colors[color],
    display,
    textAlign,
    fontWeight: bold ? 'bold' : fontWeight,
  }),
  ({ typography = 't5' }) => typographyMap[typography],
)
export default Text
