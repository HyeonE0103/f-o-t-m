import {
  parseISO,
  isSameDay,
  format,
  differenceInDays,
  addDays,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { DayPicker, DateRange } from 'react-day-picker'
import styled from '@emotion/styled'
import { colors } from '@styles/colorPalette'

interface RangePickerProps {
  startDate?: string
  endDate?: string
  onChange: (dateRange: { from?: string; to?: string; nights: number }) => void
}

const RangePicker = ({ startDate, endDate, onChange }: RangePickerProps) => {
  const today = new Date()

  const handleDayClick = (dateRange: DateRange | undefined) => {
    if (dateRange == null) {
      return
    }

    const { from, to } = dateRange

    // 1. 중복된 날짜(같은 날짜)
    if (from && to && isSameDay(from, to)) {
      return
    }

    onChange({
      //같은 날짜를 선택하면 to가 undefined
      from: from != null ? format(from, 'yyyy-MM-dd') : undefined,
      //from 타입이 string이기 때문에 format함수를 이용해 규격화
      to: to != null ? format(to, 'yyyy-MM-dd') : undefined,
      nights: from && to ? differenceInDays(to, from) : 0,
      //두날의 차를 구하고(몇박인지) 두개중 하나라도 선택안했다면 0으로
    })
  }

  const selected = {
    from: startDate != null ? parseISO(startDate) : undefined,
    // /startDate가 null이 아니면 parseISO를 이용해 date로 만들어줌
    to: endDate != null ? parseISO(endDate) : undefined,
  }
  return (
    <Container>
      <DayPicker
        locale={ko}
        //한국어
        mode="range"
        //single: 하루선택, multiple: 낱개로 여러개 선택, range:2개 클릭시 이어짐
        numberOfMonths={5}
        // 5개달 보여주기
        defaultMonth={today}
        //오늘의 달 기준
        onSelect={handleDayClick}
        selected={selected}
        disabled={{
          before: addDays(new Date(), 1),
          //어느날부터 선택이 가능한지
          //before: new Date()로 하면 당일부터 선택 가능함
        }}
      />
    </Container>
  )
}

const Container = styled.div`
  //container로 감싸서 DayPicker 속 클래스 스타일 정의
  padding-bottom: 80px;

  .rdp-month {
    //전체 달력
    position: relative;
    width: 100%;
    text-align: center;
    padding: 60px 0px 30px;
  }

  .rdp-caption {
    //해당 달력 년도와 월(제목)
    position: absolute;
    top: 25px;
    left: 20px;
    color: ${colors.black};
    font-weight: bold;
  }

  .rdp-nav {
    //달력 이동하는 nav
    display: none;
  }

  .rdp-table {
    //해당 달력 본문
    width: 100%;
  }

  .rdp-head .rdp-head_row {
    //요일
    font-size: 12px;
    height: 45px;
    color: ${colors.gray400};
    font-weight: bold;
  }

  .rdp-tbody .rdp-row {
    //날짜
    height: 45px;
  }

  .rdp-cell .rdp-button {
    //날짜 셀 안에 있는 버튼
    position: relative;
    width: 100%;
    line-height: 45px;
  }

  .rdp-cell .rdp-button[disabled] {
    //button중에 disabled, 즉 선택 못하는 버튼에는
    color: ${colors.gray200};
  }

  .rdp-day_selected {
    //선택된 부분
    background-color: ${colors.blue100};
  }

  .rdp-cell .rdp-day_range_start,
  .rdp-cell .rdp-day_range_end {
    //선택된 버튼 앞뒤
    color: ${colors.white};
  }

  .rdp-cell .rdp-day_range_start::after,
  .rdp-cell .rdp-day_range_end::after {
    //가상요소로 가상의 element를 추가하는 코드. after는 HTML이 끝날 때 추가됨
    z-index: -1;
    display: block;
    width: calc(100% - 1px);
    height: 45px;
    position: absolute;
    top: 50%;
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${colors.blue};
    content: '';
  }
`

export default RangePicker
