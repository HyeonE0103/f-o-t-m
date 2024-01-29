import { COLLECTIONS } from '@/constants'
import { AdBanner } from '@/models/card'
import { collection, getDocs } from 'firebase/firestore'
import { store } from './firebase'

export const getAdBanners = async () => {
  const adBannersSnapshot = await getDocs(
    collection(store, COLLECTIONS.ADBANNER),
  )

  return adBannersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as AdBanner),
  }))
}
