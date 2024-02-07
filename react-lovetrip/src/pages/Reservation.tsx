import { parse } from 'qs'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useReservation from '@/components/reservation/hook/useReservation'
import Spacing from '@shared/Spacing'
import addDelimiter from '@utils/addDelimiter'
import useUser from '@hooks/auth/useUser'
import Summary from '@/components/reservation/Summary'
import Form from '@/components/reservation/Form'

function ReservationPage() {
  const user = useUser()
  const navigate = useNavigate()

  const { startDate, endDate, nights, roomId, hotelId } = parse(
    window.location.search,
    { ignoreQueryPrefix: true },
  ) as {
    startDate: string
    endDate: string
    nights: string
    roomId: string
    hotelId: string
  }

  useEffect(() => {
    if (
      [user, startDate, endDate, nights, roomId, hotelId].some((param) => {
        //query 하나라도 유실시 뒤로보냄
        return param == null
      })
    ) {
      window.history.back()
    }
  }, [startDate, endDate, nights, roomId, hotelId, user])

  const { data, isLoading, makeReservation } = useReservation({
    hotelId,
    roomId,
  })

  if (data == null || isLoading === true) {
    return null
  }

  const { hotel, room } = data

  const handleSubmit = async (formValues: { [key: string]: string }) => {
    //폼에서 적은 값들이 key-value로 formValues로 내려옴
    const newReservation = {
      userId: user?.uid as string,
      hotelId,
      roomId,
      startDate,
      endDate,
      price: room.price * Number(nights),
      formValues,
    }

    await makeReservation(newReservation)

    navigate(`/reservation/done?hotelName=${hotel.name}`)
  }

  const buttonLabel = `${nights}박 ${addDelimiter(
    room.price * Number(nights),
  )}원 예약하기`

  return (
    <div>
      <Summary
        hotelName={hotel.name}
        room={room}
        startDate={startDate}
        endDate={endDate}
        nights={nights}
      />
      <Spacing size={8} backgroundColor="gray100" />
      <Form
        onSubmit={handleSubmit}
        //버튼이 클릭되었을때 handleSubmit(form)과 안에 onSubmit(정의함수)이 실행됨
        //이때 handleSubmit에서 formValues:FormData를 전달해줌
        forms={hotel.forms}
        buttonLabel={buttonLabel}
      />
    </div>
  )
}

export default ReservationPage
