import {
  QuerySnapshot,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  where,
  limit,
  startAfter,
  getDocs,
} from 'firebase/firestore'

import { COLLECTIONS } from '@constants/collection'
import {
  Transaction,
  TransactionFilterType,
  TransactionType,
} from '@models/transaction'
import { store } from '@remote/firebase'

export function createTransaction(newTrasaction: Transaction) {
  //거래 기록
  return setDoc(doc(collection(store, COLLECTIONS.TRANSACTION)), newTrasaction)
}

export async function getTransactions({
  //조건에 따라 만들어진 query 페이지네이션된 데이터 내보내기
  pageParam,
  userId,
  filter = 'all',
  //기본 filter는 all
}: {
  userId: string
  pageParam?: QuerySnapshot<TransactionType>
  filter?: TransactionFilterType
}) {
  const transactionQuery = generateQuery({ pageParam, userId, filter })

  const transactionSnapshot = await getDocs(transactionQuery)
  const lastVisible =
    transactionSnapshot.docs[transactionSnapshot.docs.length - 1]

  const items = transactionSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Transaction),
  }))

  return { items, lastVisible }
}

function generateQuery({
  //조건에 따라 query만들기
  filter,
  pageParam,
  userId,
}: {
  userId: string
  pageParam?: QuerySnapshot<TransactionType>
  filter?: TransactionFilterType
}) {
  const baseQuery = query(
    collection(store, COLLECTIONS.TRANSACTION),
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(15),
  )

  if (filter !== 'all') {
    if (pageParam == null) {
      //filter의 조건이 all이 아니고 데이터를 처음 불러올때
      return query(baseQuery, where('type', '==', filter))
    }
    return query(baseQuery, startAfter(pageParam), where('type', '==', filter))
  } else {
    if (pageParam == null) {
      return baseQuery
    }

    return query(baseQuery, startAfter(pageParam))
  }
}
