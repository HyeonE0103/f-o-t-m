import styled from '@emotion/styled'
import { colors, Colors } from '@styles/colorPalette'

interface TagProps {
  color?: string
  backgroundColor?: string
}

const Tag = styled.span<TagProps>(
  ({ color = colors.white, backgroundColor = colors.blue }) => ({
    fontSize: '11px',
    padding: '4px 5px',
    fontWeight: 'bold',
    borderRadius: '2px',
    textAlign: 'center',
    color: color in colors ? colors[color as Colors] : color,
    /*데이터에서 해당 태그의 스타일도 같이 보내주는데 프로젝트에서 정의한 방식이 아닌
    '#FFFFFF'같은 경우로 내려온다면 프론트에 지정한 color도
    서버에서 보내준 컬러도 사용할 수 있도록 해야함 이럴때 해당 color가
    정의된 요소에 있는지 파악하고 있다면 정의된 요소의 color를 아니면 값을 넣어줌*/
    backgroundColor:
      backgroundColor in colors
        ? colors[backgroundColor as Colors]
        : backgroundColor,
  }),
)

export default Tag
