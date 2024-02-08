import { colors, Colors } from '@/styles/colorPalette'
import styled from '@emotion/styled'

interface SpacingProps {
  size: number
  direction?: 'vertical' | 'horizontal'
  backgroundColor?: Colors
}
//size만 있을 경우 세로로 띄움

const Spacing = styled.div<SpacingProps>`
  ${({ size, direction = 'vertical' }) =>
    direction === 'vertical' ? `height: ${size}px;` : `width: ${size}px;`}

  ${({ backgroundColor }) =>
    backgroundColor &&
    `background-color: ${colors[backgroundColor]};`} //backgroundColor가 있을때만 해당 요소 적용
`
export default Spacing
