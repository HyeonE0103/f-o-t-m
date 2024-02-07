import qs from 'qs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import FixedBottomButton from '@shared/FixedBottomButton'
import RangePicker from '@shared/RangePicker'

const SchedulePage = () => {
  const navigate = useNavigate()

  const { roomId = '', hotelId = '' } = qs.parse(window.location.search, {
    //{?roomId: '7bdC6LQWc0smMJEahLSW', hotelId: '6vaWHy6bL7t6kwaOu7rP'}
    ignoreQueryPrefix: true,
    //{roomId: '7bdC6LQWc0smMJEahLSW', hotelId: '6vaWHy6bL7t6kwaOu7rP'}
  }) as {
    roomId: string
    hotelId: string
  }

  const [selectedDate, setSelectedDate] = useState<{
    startDate?: string
    endDate?: string
    nights: number
  }>({
    startDate: undefined,
    endDate: undefined,
    nights: 0,
  })

  useEffect(() => {
    if (roomId === '' || hotelId === '') {
      //값이 유실됬을 경우 잘못된 접근이라 판단하여 뒤로가기
      window.history.back()
    }
  }, [roomId, hotelId])

  const moveToReservationPage = () => {
    const params = qs.stringify(
      {
        hotelId,
        roomId,
        ...selectedDate,
      },
      { addQueryPrefix: true },
    )

    navigate(`/reservation${params}`)
  }

  const 제출가능한가 =
    //날짜를 다 선택했을 경우
    selectedDate.startDate != null && selectedDate.endDate != null

  const buttonLabel = 제출가능한가
    ? `${selectedDate.startDate} - ${selectedDate.endDate} (${selectedDate.nights}박)`
    : '예약 날짜를 선택해주세요'

  return (
    <div>
      <RangePicker
        startDate={selectedDate.startDate}
        endDate={selectedDate.endDate}
        onChange={(dateRange) => {
          setSelectedDate({
            startDate: dateRange.from,
            endDate: dateRange.to,
            nights: dateRange.nights,
          })
        }}
      />
      <FixedBottomButton
        label={buttonLabel}
        disabled={제출가능한가 === false}
        onClick={moveToReservationPage}
      />
    </div>
  )
}

export default SchedulePage
