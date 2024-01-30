import { COLLECTIONS } from '@/constants'
import { Card } from '@/models/card'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  QuerySnapshot,
  startAfter,
} from 'firebase/firestore'
import { store } from './firebase'

export const getCards = async (pageParam?: QuerySnapshot<Card>) => {
  //pageParam은 지금 보이고 있는 맨 마지막 요소
  const cardQuery =
    //맨처음 부른 요소라면 커서가 없음. 따라서 있을 경우와 없을 경우를 나눔
    pageParam == null
      ? await query(collection(store, COLLECTIONS.CARD), limit(10))
      : //첫번째 호출이라면 처음 10개의 데이터 가져옴
        await query(
          collection(store, COLLECTIONS.CARD),
          startAfter(pageParam),
          limit(10),
        ) //pageParam으로부터 다음 10개

  const cardSnapshot = await getDocs(cardQuery)

  const lastVisible = cardSnapshot.docs[cardSnapshot.docs.length - 1]
  //지금 불러온 Snapshot에 맨 마지막 데이터

  const items = cardSnapshot.docs.map((doc) => ({
    //나열될 총 데이터
    id: doc.id,
    ...(doc.data() as Card),
  }))

  return { items, lastVisible }
}

export const getCard = async (id: string) => {
  const snapshot = await getDoc(doc(store, COLLECTIONS.CARD, id))
  //앱에 있는 card collections 안에 있는 id를 가진 문서 찾음

  return {
    id,
    ...(snapshot.data() as Card),
  }
}
