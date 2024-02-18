import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { store } from '@remote/firebase'
import { COLLECTIONS } from '@constants/collection'
import { Account } from '@models/account'

export function setTerms({
  // 어떤 유저가 어떤 약관에 동의했는지
  userId,
  termIds,
}: {
  userId: string
  termIds: string[]
}) {
  return setDoc(doc(collection(store, COLLECTIONS.TERMS), userId), {
    userId,
    termIds,
  })
}

export async function getTerms(userId: string) {
  const snapshot = await getDoc(
    doc(collection(store, COLLECTIONS.TERMS), userId),
  )

  if (snapshot.exists() === false) {
    return null
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as { userId: string; termIds: string[] }),
  }
}

export function createAccount(newAccount: Account) {
  return setDoc(
    doc(collection(store, COLLECTIONS.ACCOUNT), newAccount.userId),
    //문서는 newAccount.userId로 관리하고 내용은 newAccount
    newAccount,
  )
}

export async function getAccount(userId: string) {
  //유저 id를 베이스로 통장문서를 찾아주는 remote 함수
  const snapshot = await getDoc(
    doc(collection(store, COLLECTIONS.ACCOUNT), userId),
  )

  if (snapshot.exists() === false) {
    return null
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Account),
  }
}

export function updateAccountBalance(userId: string, balance: number) {
  //유저의 잔고 업데이트
  const snapshot = doc(collection(store, COLLECTIONS.ACCOUNT), userId)

  return updateDoc(snapshot, { balance })
}

// termIds = [1, 2, 3] => [1, 3]
export function updateTerms(userId: string, termIds: string[]) {
  const snapshot = doc(collection(store, COLLECTIONS.TERMS), userId)

  return updateDoc(snapshot, { termIds })
  //찾은 문서를 바탕으로 업데이트 되기 원하는 데이터를 업데이트
}
