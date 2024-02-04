import { doc, collection, writeBatch } from 'firebase/firestore'

import { store } from '@remote/firebase'
import Button from '@shared/Button'
import { HOTEL_NAMES, IMAGES, HOTEL, EVENTS, ROOMS } from '@/mock/data'
import { COLLECTIONS } from '@constants'

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const HotelListAddButton = () => {
  const batch = writeBatch(store)

  const handleButtonClick = () => {
    const hotels = HOTEL_NAMES.map((hotelName, idx) => {
      return {
        name: hotelName,
        mainImageUrl: IMAGES[Math.floor(Math.random() * IMAGES.length)],
        images: IMAGES,
        price: random(130000, 200000),
        starRating: random(1, 5),
        ...HOTEL,
        ...(EVENTS[idx] != null && { events: EVENTS[idx] }),
      }
    })

    hotels.forEach((hotel) => {
      const hotelDocRef = doc(collection(store, COLLECTIONS.HOTEL))

      batch.set(hotelDocRef, hotel)
      //batch를 이용하여 여러 데이터를 한번에 DB에 저장

      ROOMS.forEach((room) => {
        const subDocRef = doc(collection(hotelDocRef, COLLECTIONS.ROOM))
        //호텔안에 있는 객실을 따로 콜렉션으로 만들되 호텔컬렉션 안에 컬렉션으로 계층구조로 만듬
        batch.set(subDocRef, room)
      })
    })

    batch.commit()
  }

  return <Button onClick={handleButtonClick}>호텔 리스트 추가</Button>
}

export default HotelListAddButton
