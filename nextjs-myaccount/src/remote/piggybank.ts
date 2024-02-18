import {
  collection,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'

import { store } from '@remote/firebase'
import { Piggybank } from '@models/piggybank'
import { COLLECTIONS } from '@constants/collection'

export function createPiggybank(newPiggybank: Piggybank) {
  //저금통 DB 추가
  return setDoc(doc(collection(store, COLLECTIONS.PIGGYBANK)), newPiggybank)
}

export async function getPiggybank(userId: string) {
  //종료일자가 지나지 않는 저금통을 오름차순으로 정리해서 가져옴
  const snapshot = await getDocs(
    query(
      collection(store, COLLECTIONS.PIGGYBANK),
      where('userId', '==', userId),
      where('endDate', '>=', new Date()),
      orderBy('endDate', 'asc'),
      limit(1),
    ),
  )

  if (snapshot.docs.length === 0) {
    return null
  }

  const piggybank = snapshot.docs[0].data()

  return {
    id: snapshot.docs[0].id,
    ...(piggybank as Piggybank),
    startDate: piggybank.startDate.toDate(),
    //firebase에서 타임스탬프 형식으로 바꿔버리기 때문에
    //데이터를 가져올때 다시 Date 타입으로 변경
    endDate: piggybank.endDate.toDate(),
  }
}
