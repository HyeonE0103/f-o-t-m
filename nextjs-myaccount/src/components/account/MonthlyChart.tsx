import { memo, useMemo } from 'react'
import { parseISO, format } from 'date-fns'

import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import { colors } from '@styles/colorPalette'
import { AxisBottom } from '@visx/axis'
//x축과 y축 데이터들을 어떤 기준으로 삼고 있는지 정보를 넘겨줄수 있는 라이브러리

// 월별 데이터
// - 날짜: 월별 마지막일자
// - 잔고: 월별 마지막일자의 잔고
interface ChartData {
  // x
  date: string
  // y
  balance: number
}

interface MonthlyChartProps {
  chartData: ChartData[]
  width: number
  height: number
}

const verticalMargin = 120

//어떤것을 기준으로 삼을지
const getX = (d: ChartData) => d.date
const getY = (d: ChartData) => d.balance

const formatDate = (date: string) => format(parseISO(date), 'M월')
//x축 각 부분 네이밍

function MonthlyChart({ chartData, width, height }: MonthlyChartProps) {
  // bounds
  const xMax = width
  const yMax = height - verticalMargin

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: chartData.map(getX),
        padding: 0.4,
      }),
    [xMax, chartData],
  )

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...chartData.map(getY))],
      }),
    [yMax, chartData],
  )

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        {chartData.map((d) => {
          const date = getX(d)
          const barWidth = xScale.bandwidth()
          const barHeight = yMax - (yScale(getY(d)) ?? 0)
          const barX = xScale(date)
          const barY = yMax - barHeight

          return (
            <Bar
              key={date}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={colors.blue}
            />
          )
        })}
      </Group>
      <AxisBottom
        top={yMax + 60}
        scale={xScale}
        tickFormat={formatDate}
        stroke={colors.blue}
        tickStroke={colors.blue}
        tickLabelProps={{
          fill: colors.blue,
          fontSize: 12,
          textAnchor: 'middle',
        }}
      />
    </svg>
  )
}

interface ChartWrapperProps {
  height?: number
  chartData: ChartData[]
}

function ChartWrapper({ height = 200, chartData }: ChartWrapperProps) {
  // 외부에서 높이값을 받을 수 있되 기본은 200
  return (
    <ParentSize>
      {/* parentsize에서는 지금의 넓이값을 내려줌(뷰포트가 바뀔때마다 동작)
      따라서 뷰포트 값을 넓이값으로 내려줌(차트의 넓이를 유동적으로 변경) */}
      {({ width }) => (
        <MonthlyChart width={width} height={height} chartData={chartData} />
      )}
    </ParentSize>
  )
}

export default memo(ChartWrapper)
//차트를 그리는 작업은 무거운 작업이고 데이터가 실시간으로 바뀌는 데이터가 아니므로 memo
