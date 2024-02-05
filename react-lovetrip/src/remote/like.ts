import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  limit,
  setDoc,
  doc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore'

import { store } from './firebase'
import { COLLECTIONS } from '@constants'
import { Like } from '@models/like'
import { Hotel } from '@models/hotel'

export const getLikes = async ({ userId }: { userId: string }) => {
  //특정 유저가 가지고 있는 Like 목록을 가져옴
  const snapshot = await getDocs(
    query(
      collection(store, COLLECTIONS.LIKE),
      where('userId', '==', userId),
      //찜하기 목록중 userId라는 값이 userId와 같은것만 가져와
      orderBy('order', 'asc'),
      //오름차순 정리(1,2,3)
    ),
  )

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Like,
  )
}

// 이미 찜이되어있다면 -> 삭제
// 찜 x -> 저장
export const toggleLike = async ({
  hotel,
  userId,
}: {
  hotel: Pick<Hotel, 'name' | 'id' | 'mainImageUrl'>
  // like에 정의되어있는 3가지
  userId: string
}) => {
  const findSnapshot = await getDocs(
    query(
      collection(store, COLLECTIONS.LIKE),
      where('userId', '==', userId), //userId와 hotelId가 같은게 있는지 확인
      where('hotelId', '==', hotel.id),
    ),
  )

  // 이미 존재함 => 삭제
  if (findSnapshot.docs.length > 0) {
    // 1, 2(삭제), [3, 4] - 1 => [2, 3] order 값을 땡겨주어야 함
    const removeTarget = findSnapshot.docs[0]
    const removeTargetOrder = removeTarget.data().order

    const updateTargetSnapshot = await getDocs(
      query(
        collection(store, COLLECTIONS.LIKE),
        where('userId', '==', userId),
        where('order', '>', removeTargetOrder), //타겟 오더보다 큰놈들
      ),
    )

    if (updateTargetSnapshot.empty) {
      //더큰놈이 없음 타겟이 제일 마지막 놈이었음
      return deleteDoc(removeTarget.ref) //놈만 삭제
    } else {
      const batch = writeBatch(store)

      updateTargetSnapshot.forEach((doc) => {
        //업데이트 대상들을 순회하면서 order값을 -1해 값을 땡겨줌
        batch.update(doc.ref, { order: doc.data().order - 1 })
      })

      await batch.commit() //땡긴값 DB업데이트

      return deleteDoc(removeTarget.ref) //땡긴 후 삭제
    }
  } else {
    // 없음 => 생성

    const lastLikeSnapshot = await getDocs(
      query(
        collection(store, COLLECTIONS.LIKE),
        where('userId', '==', userId), //userId가 같은것
        orderBy('order', 'desc'), //order의 내림차순(3,2,1)
        limit(1), //order가 제일 큰놈 뽑아옴
      ),
    )

    const lastOrder = lastLikeSnapshot.empty
      ? 0 //첫문서일 경우
      : lastLikeSnapshot.docs[0].data().order
    //현재 마지막 order

    const newLike = {
      order: lastOrder + 1, //order는 1부터 시작이네 ㅇㅁㅇ
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelMainImageUrl: hotel.mainImageUrl,
      userId,
    }

    return setDoc(doc(collection(store, COLLECTIONS.LIKE)), newLike)
  }
}

export function updateOrder(likes: Like[]) {
  const batch = writeBatch(store)

  likes.forEach((like) => {
    batch.update(doc(collection(store, COLLECTIONS.LIKE), like.id), {
      order: like.order,
    })
  })

  return batch.commit()
}
