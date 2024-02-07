import {
  collection,
  doc,
  query,
  orderBy,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'

import { store } from './firebase'
import { COLLECTIONS } from '@constants'
import { Review } from '@models/review'
import { User } from '@models/user'

export const getReviews = async ({ hotelId }: { hotelId: string }) => {
  const hotelRef = doc(store, COLLECTIONS.HOTEL, hotelId)
  const reviewQuery = query(
    collection(hotelRef, COLLECTIONS.REVIEW),
    //호텔 컬렉션 아래 있는 리뷰 컬렉션
    orderBy('createdAt', 'desc'),
    //createdAt 기준으로 내림차순 정렬
  )

  const reviewSnapshot = await getDocs(reviewQuery)

  const reviews = reviewSnapshot.docs.map((doc) => {
    const review = doc.data()

    return {
      id: doc.id,
      ...review,
      createdAt: review.createdAt.toDate() as Date,
      // createdAt에 타입이 Date인데 firestore에서 Date 타입을 firestore
      // 타입스탬프로 변경해버려 가져올때는 다시 Date 타입으로 변경해주어야 함
    } as Review
  })

  //댓글에서 유저 정보를 가져올때 한 유저가 여러개의 댓글을 썼을 경우
  //매번 불러오면 비효율적이니 유저 정보를 캐시함
  const userMap: {
    [key: string]: User
  } = {}
  const results: Array<Review & { user: User }> = []
  //Review타입과 User 타입을 가지고 있는 배열

  for (let review of reviews) {
    const 캐시된유저 = userMap[review.userId]

    if (캐시된유저 == null) {
      //캐시된 유저가 아니라면 DB에서 유저 정보 가져와 캐시함
      const userSnapshot = await getDoc(
        doc(collection(store, COLLECTIONS.USER), review.userId),
      )
      const user = userSnapshot.data() as User

      userMap[review.userId] = user
      results.push({
        ...review,
        user,
      })
    } else {
      //캐시된 유저라면 갖다 쓰고
      results.push({
        ...review,
        user: 캐시된유저,
      })
    }
  }

  return results
}

export const writeReview = (review: Omit<Review, 'id'>) => {
  // Review는 id를 가지고 있는데 문서가 생성될때 부여되기 때문에 Omit으로 id를 제외한 Review 타입
  const hotelRef = doc(store, COLLECTIONS.HOTEL, review.hotelId)
  const reviewRef = doc(collection(hotelRef, COLLECTIONS.REVIEW))

  return setDoc(reviewRef, review)
  //호텔콜렉션 안에 리뷰 콜렉션에 문서 저장
}

export const removeReview = ({
  reviewId,
  hotelId,
}: {
  reviewId: string
  hotelId: string
}) => {
  const hotelRef = doc(store, COLLECTIONS.HOTEL, hotelId)
  const reviewRef = doc(collection(hotelRef, COLLECTIONS.REVIEW), reviewId)
  //호텔 콜렉션 안에 리뷰 콜렉션 안에 reviewId인 문서 삭제
  return deleteDoc(reviewRef)
}
