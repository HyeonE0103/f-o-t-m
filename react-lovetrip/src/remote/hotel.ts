import {
  QuerySnapshot,
  collection,
  limit,
  query,
  getDocs,
  startAfter,
  getDoc,
  doc,
  where,
  documentId,
} from 'firebase/firestore'

import { COLLECTIONS } from '@constants'
import { Hotel } from '@models/hotel'

import { store } from './firebase'

export const getHotels = async (pageParams?: QuerySnapshot<Hotel>) => {
  //인피니티 스크롤 예정. pageParams = 커서를 받음

  const hotelsQuery =
    pageParams == null
      ? query(collection(store, COLLECTIONS.HOTEL), limit(10))
      : //최초의 호출(pageParams 없음)
        query(
          collection(store, COLLECTIONS.HOTEL),
          startAfter(pageParams),
          limit(10),
        ) //최초외의 호출(pageParams 있음)

  const hotelsSnapshot = await getDocs(hotelsQuery)

  const items = hotelsSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Hotel,
  )

  const lastVisible = hotelsSnapshot.docs[hotelsSnapshot.docs.length - 1]

  return {
    items, //호텔데이터
    lastVisible, //불러온 데이터의 마지막 요소. 다음 호출때 커서를 참조할 수 있도록
  }
}

export const getHotel = async (id: string) => {
  const snapshot = await getDoc(doc(store, COLLECTIONS.HOTEL, id))

  return {
    id,
    ...snapshot.data(),
  } as Hotel
}

export const getRecommendHotels = async (hotelIds: string[]) => {
  const recommendQuery = query(
    collection(store, COLLECTIONS.HOTEL),
    //store에 HOTEL콜렉션에서
    where(documentId(), 'in', hotelIds),
    //hotelIds 배열에 있는 값을 포함하고 있는 문서들
  )

  const snapshot = await getDocs(recommendQuery)

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Hotel,
  )
}
