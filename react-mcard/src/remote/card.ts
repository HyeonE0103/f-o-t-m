import { COLLECTIONS } from '@/constants'
import { Card } from '@/models/card'
import { collection, getDocs } from 'firebase/firestore'
import { store } from './firebase'

export const getCards = async () => {
  const cardSnapshot = await getDocs(collection(store, COLLECTIONS.CARD))

  return cardSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Card),
  }))
}
