import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { COLLECTIONS } from '@constants'
import { store } from './firebase'
import { getHotel } from './hotel'

import { Reservation } from '@models/reservation'
import { Room } from '@models/room'

export const makeReservation = async (newReservation: Reservation) => {
  const hotelSnapshot = doc(store, COLLECTIONS.HOTEL, newReservation.hotelId)
  const roomSnapshot = await getDoc(
    doc(hotelSnapshot, COLLECTIONS.ROOM, newReservation.roomId),
  )

  const room = roomSnapshot.data() as Room
  const 지금잔여객실수 = room.avaliableCount

  if (지금잔여객실수 === 0) {
    //유저가 고민하는 사이 이미 다른 사람이 채갔을 경우도 있으니 잔여객실수를 확인하고 0이면 오류쓰루
    throw new Error('no room')
  }

  return Promise.all([
    //updateDoc과 setDoc으로 Promise가 2개 일어나서 앞에 각각 await을 붙여줄수도 있지만
    //2개가 함께 완료되어야 하는 상황에는 Promise.all을 이용하여 배열로 비동기 함수 넣어줌
    updateDoc(roomSnapshot.ref, {
      avaliableCount: 지금잔여객실수 - 1,
    }),
    setDoc(doc(collection(store, COLLECTIONS.RESERVATION)), newReservation),
  ])
}

export const getReservations = async ({ userId }: { userId: string }) => {
  //예약 목록 가져오기
  const reservationQuery = query(
    collection(store, COLLECTIONS.RESERVATION),
    where('userId', '==', userId),
  )

  const reservationSnapshot = await getDocs(reservationQuery)

  const result = []

  for (const reservationDoc of reservationSnapshot.docs) {
    const reservation = {
      id: reservationDoc.id,
      ...(reservationDoc.data() as Reservation),
    }

    const hotel = await getHotel(reservation.hotelId)

    result.push({
      reservation,
      hotel,
    })
  }

  return result
}
