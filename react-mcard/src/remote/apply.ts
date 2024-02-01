import { COLLECTIONS } from '@/constants'
import { ApplyValues } from '@models/apply'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { store } from './firebase'

export const applyCard = (applyValues: ApplyValues) => {
  //유저의 카드 신청하는 함수
  return addDoc(collection(store, COLLECTIONS.CARD_APPLY), applyValues)
  //CARD_APPLY 콜렉션에 데이터 저장
}

export const updateApplyCard = async ({
  //회사가 유저의 카드 신청을 심사 - 카드 신청 상태값을 업데이트 하는 함수
  cardId,
  userId,
  applyValues,
}: {
  cardId: string
  userId: string
  applyValues: Partial<ApplyValues> //부분적으로 업데이트할 수 있도록
}) => {
  const snapshot = await getDocs(
    query(
      collection(store, COLLECTIONS.CARD_APPLY),
      where('userId', '==', userId),
      where('cardId', '==', cardId),
    ),
  )

  const [applied] = snapshot.docs //배열로 내려와 그중 첫번째 요소 사용

  updateDoc(applied.ref, applyValues)
}

export const getAppliedCard = async ({
  //유저가 해당 카드를 신청했는지 여부를 확인하는 함수
  userId,
  cardId,
}: {
  userId: string
  cardId: string
}) => {
  const snapshot = await getDocs(
    query(
      collection(store, COLLECTIONS.CARD_APPLY),
      where('userId', '==', userId),
      where('cardId', '==', cardId),
    ),
  )

  if (snapshot.docs.length === 0) {
    //유저가 해당 카드를 신청한 적이 없다고 null 반환
    return null
  }

  const [applied] = snapshot.docs
  //첫번째 요소를 반환

  return applied.data() as ApplyValues
}
