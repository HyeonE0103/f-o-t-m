import {
  QuerySnapshot,
  query,
  collection,
  startAfter,
  limit,
  getDocs,
  where,
  getDoc,
  doc,
} from 'firebase/firestore'

import { Card } from '@models/card'
import { store } from '@remote/firebase'
import { COLLECTIONS } from '@constants/collection'

export async function getCards(pageParam?: QuerySnapshot<Card>) {
  const cardQuery =
    pageParam == null
      ? query(collection(store, COLLECTIONS.CARD), limit(15))
      : query(
          collection(store, COLLECTIONS.CARD),
          startAfter(pageParam),
          limit(15),
        )
  const cardSnapshot = await getDocs(cardQuery)
  const lastVisible = cardSnapshot.docs[cardSnapshot.docs.length - 1]

  const items = cardSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Card),
  }))

  return { items, lastVisible }
}

export async function getSearchCards(keyword: string) {
  const searchQuery = query(
    collection(store, COLLECTIONS.CARD),
    where('name', '>=', keyword),
    //firebase는 rdb처럼 like절이 없음
    //그래서 완벽하게 검색을 지원하기 위해서는 검색어를 사전으로 지원해주어야함
    //일이 너무 커지기 때문에 해당 키워드로 시작하는 카드를 찾도록 검색기능 만듬
    where('name', '<=', keyword + '\uf8ff'),
    //'\uf8ff' 이 유니코드 문자는 유니코드 문자들 중에 가장 큰값
    //따라서 이 조건이 의미하는 것은 keyword로 시작하는 모든 카드를 찾으라는 뜻
  )

  const cardSnapshot = await getDocs(searchQuery)

  return cardSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Card),
  }))
}

export async function getCard(id: string) {
  const snapshot = await getDoc(doc(collection(store, COLLECTIONS.CARD), id))

  return {
    id: snapshot.id,
    ...(snapshot.data() as Card),
  }
}
