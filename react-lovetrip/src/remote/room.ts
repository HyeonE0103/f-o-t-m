import { doc, getDocs, collection } from 'firebase/firestore'

import { store } from './firebase'
import { COLLECTIONS } from '@constants'
import { Room } from '@models/room'

export async function getRooms(hotelId: string) {
  const snapshot = await getDocs(
    collection(doc(store, COLLECTIONS.HOTEL, hotelId), COLLECTIONS.ROOM),
    //특정 호텔에 룸에접근
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Room),
  }))
}
