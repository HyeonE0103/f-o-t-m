import { useRef, useEffect, useState, memo } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

import { colors } from '@styles/colorPalette'
import Text from '@shared/Text'
import addDelimiter from '@utils/addDelimiter'

const 신용점수_최대값 = 1_000

interface CreditScoreChartProps {
  width?: number
  height?: number
  score: number
}

function CreditScoreChart({
  score, //0 - 1000
  width = 100,
  height = 100,
}: CreditScoreChartProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const [totalLenght, setTotalLength] = useState(0)

  useEffect(() => {
    if (pathRef.current) {
      setTotalLength(pathRef.current.getTotalLength())
      //getTotalLength함수를 이용하면 path의 전체길이를 알수 있음
    }
  }, [])

  const dashoffset = totalLenght - (score / 신용점수_최대값) * totalLenght

  return (
    <Container width={width} height={height}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 223 164"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 회색 배경 경로 */}
        <path
          ref={pathRef}
          d="M18.421 154C12.3741 140.971 9 126.458 9 111.159C9 54.7382 54.8908 9 111.5 9C168.109 9 214 54.7382 214 111.159C214 126.458 210.626 140.971 204.579 154"
          stroke={colors.gray100} //그려지는 선이 어떤색으로 그려질지
          strokeWidth="18"
          strokeLinecap="round" //끝을 둥글게 만들건지
        ></path>
        {/* 파란색 경로 */}
        <path
          d="M18.421 154C12.3741 140.971 9 126.458 9 111.159C9 54.7382 54.8908 9 111.5 9C168.109 9 214 54.7382 214 111.159C214 126.458 210.626 140.971 204.579 154"
          stroke={colors.blue980}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={totalLenght} // 전체 길이
          strokeDashoffset={dashoffset} // 움직일 길이
        ></path>
      </svg>
      <Text bold={true} css={textStyles} typography="t6">
        {score === 0 ? '???' : addDelimiter(score)}
        {/* score가 0이라면 해당 신용점수가 없는 것 즉 조회하지 않은 것이기 때문에 ?로 보여줌 */}
      </Text>
    </Container>
  )
}

const Container = styled.div<{ width: number; height: number }>(
  ({ width, height }) => ({
    position: 'relative',
    width,
    height,
  }),
)

const textStyles = css`
  position: absolute;
  bottom: 30%;
  transform: translateX(-50%);
  left: 50%;
`

export default memo(CreditScoreChart)
